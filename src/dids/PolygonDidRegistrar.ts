import {
  AgentContext,
  DidCreateOptions,
  DidCreateResult,
  DidDeactivateOptions,
  DidDeactivateResult,
  DidRegistrar,
  DidRepository,
  DidUpdateOptions,
  DidUpdateResult,
  KeyType,
  Buffer,
  DidRecord,
  DidDocumentRole,
  JsonTransformer,
  DidDocument,
} from '@aries-framework/core'
import { buildDid, validateSpecCompliantPayload } from './didPolygonUtil'
import { PolygonLedgerService } from '../ledger'
import { Resolver, ResolverRegistry } from 'did-resolver'
import { getResolver } from '@ayanworks/polygon-did-resolver'

export class PolygonDidRegistrar implements DidRegistrar {
  public readonly supportedMethods = ['polygon']
  private resolver = new Resolver(getResolver() as ResolverRegistry)

  public async create(agentContext: AgentContext, options: PolygonDidCreateOptions): Promise<DidCreateResult> {
    const ledgerService = agentContext.dependencyManager.resolve(PolygonLedgerService)
    const didRepository = agentContext.dependencyManager.resolve(DidRepository)
    const { secret } = options

    const key = await agentContext.wallet.createKey({ keyType: KeyType.K256, privateKey: secret.privateKey })

    const publicKeyHex = key.publicKey.toString('hex')

    const did = buildDid(options.method, options.options.network, publicKeyHex)
    agentContext.config.logger.info(`Creating DID on ledger: ${did}`)

    try {
      const response = await ledgerService.didRegistry.create({
        did,
        publicKeyBase58: key.publicKeyBase58,
        serviceEndpoint: options.options.endpoint,
      })

      agentContext.config.logger.info(`Published did on ledger: ${did}`)

      const didDoc = response.didDoc

      const didDocument = JsonTransformer.fromJSON(didDoc, DidDocument)

      const didRecord = new DidRecord({
        did: didDocument.id,
        role: DidDocumentRole.Created,
        didDocument,
      })

      agentContext.config.logger.info(`Saving DID record to wallet: ${did} and did document: ${didDocument}`)

      await didRepository.save(agentContext, didRecord)

      return {
        didDocumentMetadata: {},
        didRegistrationMetadata: {},
        didState: {
          state: 'finished',
          did: didDocument.id,
          didDocument: didDocument,
          secret: options.secret,
        },
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      agentContext.config.logger.error(`Error registering DID ${did} : ${errorMessage}`)
      return {
        didDocumentMetadata: {},
        didRegistrationMetadata: {},
        didState: {
          state: 'failed',
          reason: `unknownError: ${errorMessage}`,
        },
      }
    }
  }

  public async update(agentContext: AgentContext, options: PolygonDidUpdateOptions): Promise<DidUpdateResult> {
    const ledgerService = agentContext.dependencyManager.resolve(PolygonLedgerService)
    const didRepository = agentContext.dependencyManager.resolve(DidRepository)

    let didDocument: DidDocument
    let didRecord: DidRecord | null

    try {
      const isValidDidDoc = validateSpecCompliantPayload(options.didDocument)
      if (options.didDocument && isValidDidDoc === null) {
        didDocument = options.didDocument
        const resolvedDocument = await this.resolver.resolve(didDocument.id)
        didRecord = await didRepository.findCreatedDid(agentContext, didDocument.id)
        // TODO: Add condition to check if did is deactivated
        if (!resolvedDocument.didDocument || !didRecord) {
          return {
            didDocumentMetadata: {},
            didRegistrationMetadata: {},
            didState: {
              state: 'failed',
              reason: 'Did not found',
            },
          }
        }
      } else {
        return {
          didDocumentMetadata: {},
          didRegistrationMetadata: {},
          didState: {
            state: 'failed',
            reason: isValidDidDoc ?? 'Provide a valid didDocument',
          },
        }
      }

      const response = await ledgerService.didRegistry.update(didDocument.id, JSON.stringify(didDocument))

      if (!response) {
        throw new Error('Unable to update did document')
      }

      // Save the did document
      didRecord.didDocument = didDocument
      await didRepository.update(agentContext, didRecord)

      return {
        didDocumentMetadata: {},
        didRegistrationMetadata: {},
        didState: {
          state: 'finished',
          did: didDocument.id,
          didDocument,
        },
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      agentContext.config.logger.error(`Error Updating DID : ${errorMessage}`)
      return {
        didDocumentMetadata: {},
        didRegistrationMetadata: {},
        didState: {
          state: 'failed',
          reason: `unknownError: ${errorMessage}`,
        },
      }
    }
  }

  public async deactivate(agentContext: AgentContext, options: DidDeactivateOptions): Promise<DidDeactivateResult> {
    throw new Error('Method not implemented.')
  }
}

export interface PolygonDidCreateOptions extends DidCreateOptions {
  method: 'polygon'
  did?: never
  options: {
    network: string
    endpoint?: string
  }
  secret: {
    privateKey: Buffer
  }
}

export interface PolygonDidUpdateOptions extends DidUpdateOptions {
  method: 'polygon'
  did: string
  didDocument: DidDocument
  options: {
    network: string
  }
}
