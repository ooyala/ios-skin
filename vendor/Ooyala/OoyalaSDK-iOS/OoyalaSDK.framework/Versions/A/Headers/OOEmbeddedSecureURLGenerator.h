/**
 * @class      OOEmbeddedSecureURLGenerator OOEmbeddedSecureURLGenerator.h "OOEmbeddedSecureURLGenerator.h"
 * @brief      OOEmbeddedSecureURLGenerator
 * @details    OOEmbeddedSecureURLGenerator.h in OoyalaSDK
 * @date       12/1/11
 * @copyright Copyright © 2015 Ooyala, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import "OOSignatureGenerator.h"
#import "OOSecureURLGenerator.h"

/**
 * Default implementation of OOSecureURLGenerator which will generate secured Ooyala API URLs using API key and secret
 *
 * Note that embedding your API key and secret into the app is not very secure.
 * To minimize the risk, use read-only API keys if possible.
 * Alternatively, implement your own OOSignatureGenerator and keep the API keys and secrets on server-side.
 */
@interface OOEmbeddedSecureURLGenerator : NSObject <OOSecureURLGenerator> {
@private
  NSString *apiKey;
  id<OOSignatureGenerator> signatureGenerator;
}

@property(nonatomic, strong) NSString *apiKey; /**< The API Key to use */
@property(nonatomic, strong) id<OOSignatureGenerator> signatureGenerator; /**< The OOSignatureGenerator to use */

/**
 * Initialize an OOEmbeddedSecureURLGenerator
 * @param theAPIKey the API Key to use (from Backlot)
 * @param theSecret the Secret to use (from Backlot)
 * @return the initialized OOEmbeddedSecureURLGenerator
 */
- (id)initWithAPIKey:(NSString *)theAPIKey secret:(NSString *)theSecret;

/**
 * Initialize an OOEmbeddedSecureURLGenerator with custom OOSignatureGenerator implementation
 * @param theAPIKey the API Key to use (from Backlot)
 * @param theSignatureGenerator OOSignatureGenerator to use
 * @return the initialized OOEmbeddedSecureURLGenerator
 */
- (id)initWithAPIKey:(NSString *)theAPIKey signatureGenerator:(id<OOSignatureGenerator>)theSignatureGenerator;

/**
 * Generate the secure URL using the APIKey+Expires+Signature method (signature is generated using the OOSignatureGenerator)
 * @param host the hostname for the URL
 * @param uri the URI for the URL
 * @param params the URI params for the URL (not including any security params that the security method would use)
 * @return a secure NSURL created from the parameters
 */
- (NSURL *)secureURL:(NSString *)host uri:(NSString *)uri params:(NSDictionary *)params;

@end
