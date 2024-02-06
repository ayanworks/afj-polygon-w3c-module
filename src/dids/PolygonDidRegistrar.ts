import type {
  AgentContext,
  DidCreateOptions,
  DidCreateResult,
  DidDeactivateOptions,
  DidDeactivateResult,
  DidRegistrar,
  DidUpdateOptions,
  DidUpdateResult,
  Buffer,
  Wallet,
} from '@credo-ts/core'
import type { ResolverRegistry } from 'did-resolver'

import { getResolver } from '@ayanworks/polygon-did-resolver'
import { AskarWallet } from '@credo-ts/askar'
import {
  DidRepository,
  KeyType,
  DidRecord,
  DidDocumentRole,
  JsonTransformer,
  DidDocument,
  CredoError,
  WalletError,
} from '@credo-ts/core'
import { Resolver } from 'did-resolver'
import { SigningKey } from 'ethers'

import { PolygonLedgerService } from '../ledger'

import { buildDid, validateSpecCompliantPayload } from './didPolygonUtil'

export class PolygonDidRegistrar implements DidRegistrar {
  public readonly supportedMethods = ['polygon']
  private resolver = new Resolver(getResolver() as ResolverRegistry)

  public async create(agentContext: AgentContext, options: PolygonDidCreateOptions): Promise<DidCreateResult> {
    const ledgerService = agentContext.dependencyManager.resolve(PolygonLedgerService)
    const didRepository = agentContext.dependencyManager.resolve(DidRepository)

    const privateKey = options.secret.privateKey

    const key = await agentContext.wallet.createKey({ keyType: KeyType.K256, privateKey })

    const publicKeyHex = key.publicKey.toString('hex')

    const did = buildDid(options.method, options.options.network, publicKeyHex)
    agentContext.config.logger.info(`Creating DID on ledger: ${did}`)

    try {
      const signingKey = await this.getSigningKey(agentContext.wallet, key.publicKeyBase58)

      const didRegistry = ledgerService.createDidRegistryInstance(signingKey)

      const response = await didRegistry.create({
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

      if (!didRecord) {
        throw new CredoError('')
      }

      const publicKeyBase58 = await this.getPublicKeyFromDid(agentContext, options.did)

      if (!publicKeyBase58) {
        throw new CredoError('Public Key not found in wallet')
      }

      const signingKey = await this.getSigningKey(agentContext.wallet, publicKeyBase58)

      const didRegistry = ledgerService.createDidRegistryInstance(signingKey)

      const response = await didRegistry.update(didDocument.id, didDocument)

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async deactivate(agentContext: AgentContext, options: DidDeactivateOptions): Promise<DidDeactivateResult> {
    throw new Error('Method not implemented.')
  }

  private async getSigningKey(wallet: Wallet, publicKeyBase58: string): Promise<SigningKey> {
    if (!(wallet instanceof AskarWallet)) {
      throw new CredoError('Incorrect wallet type: Polygon Module currently only supports Askar wallet')
    }

    const keyEntry = await wallet.session.fetchKey({ name: publicKeyBase58 })

    if (!keyEntry) {
      throw new WalletError('Key not found in wallet')
    }

    const signingKey = new SigningKey(keyEntry.key.secretBytes)

    keyEntry.key.handle.free()

    return signingKey
  }

  private async getPublicKeyFromDid(agentContext: AgentContext, did: string) {
    const didRepository = agentContext.dependencyManager.resolve(DidRepository)

    const didRecord = await didRepository.findCreatedDid(agentContext, did)
    if (!didRecord) {
      throw new CredoError('DidRecord not found')
    }

    if (!didRecord.didDocument?.verificationMethod) {
      throw new CredoError('VerificationMethod not found cannot get public key')
    }

    const publicKeyBase58 = didRecord.didDocument.verificationMethod[0].publicKeyBase58

    return publicKeyBase58
  }
}

export interface PolygonDidCreateOptions extends DidCreateOptions {
  method: 'polygon'
  did?: never
  options: {
    network: 'mainnet' | 'testnet'
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
}
