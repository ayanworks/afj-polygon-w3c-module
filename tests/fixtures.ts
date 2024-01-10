import { CREDENTIALS_CONTEXT_V1_URL } from '@aries-framework/core'

export const EcdsaSecp256k1Signature2019Fixtures = {
  TEST_LD_DOCUMENT: {
    '@context': [CREDENTIALS_CONTEXT_V1_URL, 'https://w3id.org/citizenship/v1'],
    id: 'https://issuer.oidp.uscis.gov/credentials/83627465',
    type: ['VerifiableCredential', 'PermanentResidentCard'],
    issuer: '',
    identifier: '83627465',
    name: 'Permanent Resident Card',
    description: 'Government of Example Permanent Resident Card.',
    issuanceDate: '2019-12-03T12:19:52Z',
    expirationDate: '2029-12-03T12:19:52Z',
    credentialSubject: {
      id: 'did:example:b34ca6cd37bbf23',
      type: ['PermanentResident', 'Person'],
      givenName: 'JOHN',
      familyName: 'SMITH',
      gender: 'Male',
      image: 'data:image/png;base64,iVBORw0KGgokJggg==',
      residentSince: '2015-01-01',
      lprCategory: 'C09',
      lprNumber: '999-999-999',
      commuterClassification: 'C1',
      birthCountry: 'Bahamas',
      birthDate: '1958-07-17',
    },
  },
  TEST_LD_DOCUMENT_SIGNED: {
    '@context': [CREDENTIALS_CONTEXT_V1_URL, 'https://w3id.org/citizenship/v1'],
    id: 'https://issuer.oidp.uscis.gov/credentials/83627465',
    type: ['VerifiableCredential', 'PermanentResidentCard'],
    issuer: 'did:polygon:testnet:0x50e775B5c3050e8B2Cfa404C3dE95ab97E43e771',
    identifier: '83627465',
    name: 'Permanent Resident Card',
    description: 'Government of Example Permanent Resident Card.',
    issuanceDate: '2019-12-03T12:19:52Z',
    expirationDate: '2029-12-03T12:19:52Z',
    credentialSubject: {
      id: 'did:example:b34ca6cd37bbf23',
      type: ['PermanentResident', 'Person'],
      givenName: 'JOHN',
      familyName: 'SMITH',
      gender: 'Male',
      image: 'data:image/png;base64,iVBORw0KGgokJggg==',
      residentSince: '2015-01-01',
      lprCategory: 'C09',
      lprNumber: '999-999-999',
      commuterClassification: 'C1',
      birthCountry: 'Bahamas',
      birthDate: '1958-07-17',
    },
    proof: {
      verificationMethod: 'did:polygon:testnet:0x50e775B5c3050e8B2Cfa404C3dE95ab97E43e771#key-1',
      type: 'EcdsaSecp256k1Signature2019',
      created: '2024-01-10T14:04:36Z',
      proofPurpose: 'assertionMethod',
      jws: 'eyJhbGciOiJFY0RTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..7a1hAqUd985rNO9KZAEnVWEkaNGrWnq45cRBw2T0VmYwYrzzUUxmuH7-s1nfI7O1uKkn-oteaIBowPoUy56Fcw',
    },
  },
  TEST_LD_DOCUMENT_BAD_SIGNED: {
    '@context': [CREDENTIALS_CONTEXT_V1_URL, 'https://w3id.org/citizenship/v1'],
    id: 'https://issuer.oidp.uscis.gov/credentials/83627465',
    type: ['VerifiableCredential', 'PermanentResidentCard'],
    issuer: 'did:polygon:testnet:0x50e775B5c3050e8B2Cfa404C3dE95ab97E43e771',
    identifier: '83627465',
    name: 'Permanent Resident Card',
    description: 'Government of Example Permanent Resident Card.',
    issuanceDate: '2019-12-03T12:19:52Z',
    expirationDate: '2029-12-03T12:19:52Z',
    credentialSubject: {
      id: 'did:example:b34ca6cd37bbf23',
      type: ['PermanentResident', 'Person'],
      givenName: 'JOHN',
      familyName: 'SMITH',
      gender: 'Male',
      image: 'data:image/png;base64,iVBORw0KGgokJggg==',
      residentSince: '2015-01-01',
      lprCategory: 'C09',
      lprNumber: '999-999-999',
      commuterClassification: 'C1',
      birthCountry: 'Bahamas',
      birthDate: '1958-07-17',
    },
    proof: {
      verificationMethod: 'did:polygon:testnet:0x50e775B5c3050e8B2Cfa404C3dE95ab97E43e771#key-1',
      type: 'EcdsaSecp256k1Signature2019',
      created: '2023-12-13T14:14:10Z',
      proofPurpose: 'assertionMethod',
      jws: 'eyJhbGciOiJFY0RTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..Ej5aEUBTgeNm3_a4uO_AuNnisldnYTMMGMom4xLb-_TmoYe7467Yo046Bw2QqdfdBja6y-HBbBj4SonOlwswAg',
    },
  },
  TEST_VP_DOCUMENT: {
    '@context': [CREDENTIALS_CONTEXT_V1_URL],
    type: ['VerifiablePresentation'],
    verifiableCredential: [
      {
        '@context': [CREDENTIALS_CONTEXT_V1_URL, 'https://w3id.org/citizenship/v1'],
        id: 'https://issuer.oidp.uscis.gov/credentials/83627465',
        type: ['VerifiableCredential', 'PermanentResidentCard'],
        issuer: 'did:polygon:testnet:0x50e775B5c3050e8B2Cfa404C3dE95ab97E43e771',
        identifier: '83627465',
        name: 'Permanent Resident Card',
        description: 'Government of Example Permanent Resident Card.',
        issuanceDate: '2019-12-03T12:19:52Z',
        expirationDate: '2029-12-03T12:19:52Z',
        credentialSubject: {
          id: 'did:example:b34ca6cd37bbf23',
          type: ['PermanentResident', 'Person'],
          givenName: 'JOHN',
          familyName: 'SMITH',
          gender: 'Male',
          image: 'data:image/png;base64,iVBORw0KGgokJggg==',
          residentSince: '2015-01-01',
          lprCategory: 'C09',
          lprNumber: '999-999-999',
          commuterClassification: 'C1',
          birthCountry: 'Bahamas',
          birthDate: '1958-07-17',
        },
        proof: {
          verificationMethod: 'did:polygon:testnet:0x50e775B5c3050e8B2Cfa404C3dE95ab97E43e771#key-1',
          type: 'EcdsaSecp256k1Signature2019',
          created: '2023-12-13T14:14:10Z',
          proofPurpose: 'assertionMethod',
          jws: 'eyJhbGciOiJFY0RTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..az_ZMDbOxenDrhRA_dEGyPIkVxqFoW5Aj44rEdjcLTYyzUVmkJO4W-bAohwjX_zx2BQhhKMdRyuGWAltVzGBoQ',
        },
      },
    ],
  },
  TEST_VP_DOCUMENT_SIGNED: {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiablePresentation'],
    verifiableCredential: [
      {
        '@context': [CREDENTIALS_CONTEXT_V1_URL, 'https://w3id.org/citizenship/v1'],
        id: 'https://issuer.oidp.uscis.gov/credentials/83627465',
        type: ['VerifiableCredential', 'PermanentResidentCard'],
        issuer: 'did:polygon:testnet:0x50e775B5c3050e8B2Cfa404C3dE95ab97E43e771',
        identifier: '83627465',
        name: 'Permanent Resident Card',
        description: 'Government of Example Permanent Resident Card.',
        issuanceDate: '2019-12-03T12:19:52Z',
        expirationDate: '2029-12-03T12:19:52Z',
        credentialSubject: {
          id: 'did:example:b34ca6cd37bbf23',
          type: ['PermanentResident', 'Person'],
          givenName: 'JOHN',
          familyName: 'SMITH',
          gender: 'Male',
          image: 'data:image/png;base64,iVBORw0KGgokJggg==',
          residentSince: '2015-01-01',
          lprCategory: 'C09',
          lprNumber: '999-999-999',
          commuterClassification: 'C1',
          birthCountry: 'Bahamas',
          birthDate: '1958-07-17',
        },
        proof: {
          verificationMethod: 'did:polygon:testnet:0x50e775B5c3050e8B2Cfa404C3dE95ab97E43e771#key-1',
          type: 'EcdsaSecp256k1Signature2019',
          created: '2023-12-13T14:14:10Z',
          proofPurpose: 'assertionMethod',
          jws: 'eyJhbGciOiJFY0RTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..az_ZMDbOxenDrhRA_dEGyPIkVxqFoW5Aj44rEdjcLTYyzUVmkJO4W-bAohwjX_zx2BQhhKMdRyuGWAltVzGBoQ',
        },
      },
    ],
    proof: {
      verificationMethod: 'did:polygon:testnet:0x50e775B5c3050e8B2Cfa404C3dE95ab97E43e771#key-1',
      type: 'EcdsaSecp256k1Signature2019',
      created: '2024-01-10T14:34:17Z',
      proofPurpose: 'authentication',
      challenge: '7bf32d0b-39d4-41f3-96b6-45de52988e4c',
      domain: 'issuer.example.com',
      jws: 'eyJhbGciOiJFY0RTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..651HGLzQMh8MIl5OfObzgKYkL0D1AyX5sbFCGuMGvj5dtKp86PxnH9Y9opZ0flka7ZwD-XyRK6pbeny4kzYbyA',
    },
  },
}

export const PolygonDIDFixtures = {
  VALID_DID_DOCUMENT: {
    '@context': ['https://w3id.org/did/v1', 'https://w3id.org/security/suites/secp256k1-2019/v1'],
    id: 'did:polygon:testnet:0x50e775B5c3050e8B2Cfa404C3dE95ab97E43e771',
    verificationMethod: [
      {
        id: 'did:polygon:testnet:0x50e775B5c3050e8B2Cfa404C3dE95ab97E43e771#key-1',
        type: 'EcdsaSecp256k1VerificationKey2019',
        controller: 'did:polygon:testnet:0x50e775B5c3050e8B2Cfa404C3dE95ab97E43e771',
        publicKeyBase58: 'ygG9PXu9eooJHivLv192iyY1mNQyU7nqeUqDpw6vwWum',
      },
    ],
    authentication: [
      'did:polygon:testnet:0x50e775B5c3050e8B2Cfa404C3dE95ab97E43e771',
      {
        id: 'did:polygon:testnet:0x50e775B5c3050e8B2Cfa404C3dE95ab97E43e771#key-1',
        type: 'EcdsaSecp256k1VerificationKey2019',
        controller: 'did:polygon:testnet:0x50e775B5c3050e8B2Cfa404C3dE95ab97E43e771',
        publicKeyBase58: 'ygG9PXu9eooJHivLv192iyY1mNQyU7nqeUqDpw6vwWum',
      },
    ],
    assertionMethod: [
      'did:polygon:testnet:0x50e775B5c3050e8B2Cfa404C3dE95ab97E43e771',
      {
        id: 'did:polygon:testnet:0x50e775B5c3050e8B2Cfa404C3dE95ab97E43e771#key-1',
        type: 'EcdsaSecp256k1VerificationKey2019',
        controller: 'did:polygon:testnet:0x50e775B5c3050e8B2Cfa404C3dE95ab97E43e771',
        publicKeyBase58: 'ygG9PXu9eooJHivLv192iyY1mNQyU7nqeUqDpw6vwWum',
      },
    ],
    service: [
      {
        id: 'did:polygon:testnet:0x50e775B5c3050e8B2Cfa404C3dE95ab97E43e771#linked-domain',
        type: 'LinkedDomains',
        serviceEndpoint: 'https://example.com',
      },
    ],
  },
}
