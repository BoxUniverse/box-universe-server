'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">server documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-a7949d0e3693ee26756d6a9a66845586675a07773fbd9eaa140cfa3013ce596b93cab7b261f4d51e38aea1d3795831b324c71813e31420f7f4ffc97c638a8612"' : 'data-target="#xs-injectables-links-module-AuthModule-a7949d0e3693ee26756d6a9a66845586675a07773fbd9eaa140cfa3013ce596b93cab7b261f4d51e38aea1d3795831b324c71813e31420f7f4ffc97c638a8612"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-a7949d0e3693ee26756d6a9a66845586675a07773fbd9eaa140cfa3013ce596b93cab7b261f4d51e38aea1d3795831b324c71813e31420f7f4ffc97c638a8612"' :
                                        'id="xs-injectables-links-module-AuthModule-a7949d0e3693ee26756d6a9a66845586675a07773fbd9eaa140cfa3013ce596b93cab7b261f4d51e38aea1d3795831b324c71813e31420f7f4ffc97c638a8612"' }>
                                        <li class="link">
                                            <a href="injectables/AuthGateway.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthGateway</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CommentsModule.html" data-type="entity-link" >CommentsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CommentsModule-21023a160eb0b345be34d6f911e7ff3cc16f11e6c9d68f18cbcbae12e36eabe6c109120e18903ea29b5f8bee46c426440c7eabf57dbc4760cb5225396be46a4d"' : 'data-target="#xs-injectables-links-module-CommentsModule-21023a160eb0b345be34d6f911e7ff3cc16f11e6c9d68f18cbcbae12e36eabe6c109120e18903ea29b5f8bee46c426440c7eabf57dbc4760cb5225396be46a4d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CommentsModule-21023a160eb0b345be34d6f911e7ff3cc16f11e6c9d68f18cbcbae12e36eabe6c109120e18903ea29b5f8bee46c426440c7eabf57dbc4760cb5225396be46a4d"' :
                                        'id="xs-injectables-links-module-CommentsModule-21023a160eb0b345be34d6f911e7ff3cc16f11e6c9d68f18cbcbae12e36eabe6c109120e18903ea29b5f8bee46c426440c7eabf57dbc4760cb5225396be46a4d"' }>
                                        <li class="link">
                                            <a href="injectables/CommentsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CommentsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ConversationsModule.html" data-type="entity-link" >ConversationsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ConversationsModule-94a78ac34658d197b559c8ed5ef1bbbea343dfbdcf74023c83ce2374903133231b55dbe2eee7c70937cda5c9a6eefd132b99e8023d623bcb3ce4dc438e018537"' : 'data-target="#xs-injectables-links-module-ConversationsModule-94a78ac34658d197b559c8ed5ef1bbbea343dfbdcf74023c83ce2374903133231b55dbe2eee7c70937cda5c9a6eefd132b99e8023d623bcb3ce4dc438e018537"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ConversationsModule-94a78ac34658d197b559c8ed5ef1bbbea343dfbdcf74023c83ce2374903133231b55dbe2eee7c70937cda5c9a6eefd132b99e8023d623bcb3ce4dc438e018537"' :
                                        'id="xs-injectables-links-module-ConversationsModule-94a78ac34658d197b559c8ed5ef1bbbea343dfbdcf74023c83ce2374903133231b55dbe2eee7c70937cda5c9a6eefd132b99e8023d623bcb3ce4dc438e018537"' }>
                                        <li class="link">
                                            <a href="injectables/ConversationsGateway.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConversationsGateway</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ConversationsRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConversationsRepository</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ConversationsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConversationsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/FriendsModule.html" data-type="entity-link" >FriendsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-FriendsModule-0b26e5a47f522351fb73417bb8b550f249364c93a07dc37ba3428d67e6bca6fc6527a8ac7d726ac41c74d960b591d545c5d9afd8bdb0ecc5c8206769cf9d2c1d"' : 'data-target="#xs-injectables-links-module-FriendsModule-0b26e5a47f522351fb73417bb8b550f249364c93a07dc37ba3428d67e6bca6fc6527a8ac7d726ac41c74d960b591d545c5d9afd8bdb0ecc5c8206769cf9d2c1d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-FriendsModule-0b26e5a47f522351fb73417bb8b550f249364c93a07dc37ba3428d67e6bca6fc6527a8ac7d726ac41c74d960b591d545c5d9afd8bdb0ecc5c8206769cf9d2c1d"' :
                                        'id="xs-injectables-links-module-FriendsModule-0b26e5a47f522351fb73417bb8b550f249364c93a07dc37ba3428d67e6bca6fc6527a8ac7d726ac41c74d960b591d545c5d9afd8bdb0ecc5c8206769cf9d2c1d"' }>
                                        <li class="link">
                                            <a href="injectables/FriendsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FriendsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/LikesModule.html" data-type="entity-link" >LikesModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-LikesModule-46c2daeb4fe570f969db18d5f5f47d01edd1420814be74a8f8713fac5a204cad9aa9b9b6025c05ca9ed80f691ac3ad7e99f77ba1861b756255e30e420980534e"' : 'data-target="#xs-injectables-links-module-LikesModule-46c2daeb4fe570f969db18d5f5f47d01edd1420814be74a8f8713fac5a204cad9aa9b9b6025c05ca9ed80f691ac3ad7e99f77ba1861b756255e30e420980534e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-LikesModule-46c2daeb4fe570f969db18d5f5f47d01edd1420814be74a8f8713fac5a204cad9aa9b9b6025c05ca9ed80f691ac3ad7e99f77ba1861b756255e30e420980534e"' :
                                        'id="xs-injectables-links-module-LikesModule-46c2daeb4fe570f969db18d5f5f47d01edd1420814be74a8f8713fac5a204cad9aa9b9b6025c05ca9ed80f691ac3ad7e99f77ba1861b756255e30e420980534e"' }>
                                        <li class="link">
                                            <a href="injectables/LikesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LikesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MessagesModule.html" data-type="entity-link" >MessagesModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-MessagesModule-b94c8acbfdc47bf825b9a8703d6819d8fb3f190ec262b37e2696d0e999bf574f4982568151e397d05b126649f28773857c9cd30ad9463f94640dc4b76e8ea7e7"' : 'data-target="#xs-injectables-links-module-MessagesModule-b94c8acbfdc47bf825b9a8703d6819d8fb3f190ec262b37e2696d0e999bf574f4982568151e397d05b126649f28773857c9cd30ad9463f94640dc4b76e8ea7e7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MessagesModule-b94c8acbfdc47bf825b9a8703d6819d8fb3f190ec262b37e2696d0e999bf574f4982568151e397d05b126649f28773857c9cd30ad9463f94640dc4b76e8ea7e7"' :
                                        'id="xs-injectables-links-module-MessagesModule-b94c8acbfdc47bf825b9a8703d6819d8fb3f190ec262b37e2696d0e999bf574f4982568151e397d05b126649f28773857c9cd30ad9463f94640dc4b76e8ea7e7"' }>
                                        <li class="link">
                                            <a href="injectables/MessagesGateway.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MessagesGateway</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MessagesRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MessagesRepository</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MessagesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MessagesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/NotificationsModule.html" data-type="entity-link" >NotificationsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-NotificationsModule-67eed2d969aed3f856eab9865da9c292a02aea2c848dfafebc0ab03be72ad566fd3c3157ade2b9187a1466b0ee38b7dc9ad334ef71a0f0723d278ade350eb5cd"' : 'data-target="#xs-injectables-links-module-NotificationsModule-67eed2d969aed3f856eab9865da9c292a02aea2c848dfafebc0ab03be72ad566fd3c3157ade2b9187a1466b0ee38b7dc9ad334ef71a0f0723d278ade350eb5cd"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-NotificationsModule-67eed2d969aed3f856eab9865da9c292a02aea2c848dfafebc0ab03be72ad566fd3c3157ade2b9187a1466b0ee38b7dc9ad334ef71a0f0723d278ade350eb5cd"' :
                                        'id="xs-injectables-links-module-NotificationsModule-67eed2d969aed3f856eab9865da9c292a02aea2c848dfafebc0ab03be72ad566fd3c3157ade2b9187a1466b0ee38b7dc9ad334ef71a0f0723d278ade350eb5cd"' }>
                                        <li class="link">
                                            <a href="injectables/NotificationsGateway.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotificationsGateway</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/NotificationsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotificationsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PostsModule.html" data-type="entity-link" >PostsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-PostsModule-e418b43dca887c072396d682d8f9798cce5451816a0c1419fb3e5cf7d3a7a4655be903eb4990686cd64b49bae803f735846f02c10f5dbfd7b93ff558c078e383"' : 'data-target="#xs-injectables-links-module-PostsModule-e418b43dca887c072396d682d8f9798cce5451816a0c1419fb3e5cf7d3a7a4655be903eb4990686cd64b49bae803f735846f02c10f5dbfd7b93ff558c078e383"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PostsModule-e418b43dca887c072396d682d8f9798cce5451816a0c1419fb3e5cf7d3a7a4655be903eb4990686cd64b49bae803f735846f02c10f5dbfd7b93ff558c078e383"' :
                                        'id="xs-injectables-links-module-PostsModule-e418b43dca887c072396d682d8f9798cce5451816a0c1419fb3e5cf7d3a7a4655be903eb4990686cd64b49bae803f735846f02c10f5dbfd7b93ff558c078e383"' }>
                                        <li class="link">
                                            <a href="injectables/PostsGateway.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PostsGateway</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PostsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PostsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProfilesModule.html" data-type="entity-link" >ProfilesModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ProfilesModule-11744ac3d007330968356a68ce12fa009dd22090efb82b0ac859925fbc0c881d45b096617c563d5ea850be1f2c450a6b7b4396ffec5d428c508d4a904eebe7a3"' : 'data-target="#xs-injectables-links-module-ProfilesModule-11744ac3d007330968356a68ce12fa009dd22090efb82b0ac859925fbc0c881d45b096617c563d5ea850be1f2c450a6b7b4396ffec5d428c508d4a904eebe7a3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProfilesModule-11744ac3d007330968356a68ce12fa009dd22090efb82b0ac859925fbc0c881d45b096617c563d5ea850be1f2c450a6b7b4396ffec5d428c508d4a904eebe7a3"' :
                                        'id="xs-injectables-links-module-ProfilesModule-11744ac3d007330968356a68ce12fa009dd22090efb82b0ac859925fbc0c881d45b096617c563d5ea850be1f2c450a6b7b4396ffec5d428c508d4a904eebe7a3"' }>
                                        <li class="link">
                                            <a href="injectables/ProfilesGateway.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfilesGateway</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ProfilesRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfilesRepository</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ProfilesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfilesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PubSubModule.html" data-type="entity-link" >PubSubModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RequestsModule.html" data-type="entity-link" >RequestsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-RequestsModule-0ab51f076b18d309510afa01408b3b4247bb3fc96e00fef397a45e24a15d170d860712bb3d34138835d96fdaf5ebf1638ae2105aaf30c93c0b0d6aa0864b4815"' : 'data-target="#xs-injectables-links-module-RequestsModule-0ab51f076b18d309510afa01408b3b4247bb3fc96e00fef397a45e24a15d170d860712bb3d34138835d96fdaf5ebf1638ae2105aaf30c93c0b0d6aa0864b4815"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RequestsModule-0ab51f076b18d309510afa01408b3b4247bb3fc96e00fef397a45e24a15d170d860712bb3d34138835d96fdaf5ebf1638ae2105aaf30c93c0b0d6aa0864b4815"' :
                                        'id="xs-injectables-links-module-RequestsModule-0ab51f076b18d309510afa01408b3b4247bb3fc96e00fef397a45e24a15d170d860712bb3d34138835d96fdaf5ebf1638ae2105aaf30c93c0b0d6aa0864b4815"' }>
                                        <li class="link">
                                            <a href="injectables/RequestsGateway.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RequestsGateway</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RequestsRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RequestsRepository</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RequestsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RequestsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/S3Module.html" data-type="entity-link" >S3Module</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-S3Module-3d5eba0908fd74e1ba89b0b067dfb026b0819160cd354a094d0d7768c6e3d03277ead40be31fdc9f849ac9ad6f79b5eeecb3a526e8d8ae1cdf0f135930dbdf14"' : 'data-target="#xs-injectables-links-module-S3Module-3d5eba0908fd74e1ba89b0b067dfb026b0819160cd354a094d0d7768c6e3d03277ead40be31fdc9f849ac9ad6f79b5eeecb3a526e8d8ae1cdf0f135930dbdf14"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-S3Module-3d5eba0908fd74e1ba89b0b067dfb026b0819160cd354a094d0d7768c6e3d03277ead40be31fdc9f849ac9ad6f79b5eeecb3a526e8d8ae1cdf0f135930dbdf14"' :
                                        'id="xs-injectables-links-module-S3Module-3d5eba0908fd74e1ba89b0b067dfb026b0819160cd354a094d0d7768c6e3d03277ead40be31fdc9f849ac9ad6f79b5eeecb3a526e8d8ae1cdf0f135930dbdf14"' }>
                                        <li class="link">
                                            <a href="injectables/S3Service.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >S3Service</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UsersModule-98fd0320c7b8cbcf015706f9a06c0147b39f399f07fb827b1adbacdbad129f4b2291930f7052bf4f547b106e3b2c731f367d49cd64382ad893a83f9340b0c474"' : 'data-target="#xs-injectables-links-module-UsersModule-98fd0320c7b8cbcf015706f9a06c0147b39f399f07fb827b1adbacdbad129f4b2291930f7052bf4f547b106e3b2c731f367d49cd64382ad893a83f9340b0c474"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-98fd0320c7b8cbcf015706f9a06c0147b39f399f07fb827b1adbacdbad129f4b2291930f7052bf4f547b106e3b2c731f367d49cd64382ad893a83f9340b0c474"' :
                                        'id="xs-injectables-links-module-UsersModule-98fd0320c7b8cbcf015706f9a06c0147b39f399f07fb827b1adbacdbad129f4b2291930f7052bf4f547b106e3b2c731f367d49cd64382ad893a83f9340b0c474"' }>
                                        <li class="link">
                                            <a href="injectables/UsersRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersRepository</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/_Upload_.html" data-type="entity-link" >_Upload_</a>
                            </li>
                            <li class="link">
                                <a href="classes/AccessTokenResponse.html" data-type="entity-link" >AccessTokenResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppGateway.html" data-type="entity-link" >AppGateway</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthResolver.html" data-type="entity-link" >AuthResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChangeNameConversation.html" data-type="entity-link" >ChangeNameConversation</a>
                            </li>
                            <li class="link">
                                <a href="classes/Comment.html" data-type="entity-link" >Comment</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommentsRepository.html" data-type="entity-link" >CommentsRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommentsResolver.html" data-type="entity-link" >CommentsResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/Conversation.html" data-type="entity-link" >Conversation</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConversationsProcessor.html" data-type="entity-link" >ConversationsProcessor</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConversationsResolver.html" data-type="entity-link" >ConversationsResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/Create.html" data-type="entity-link" >Create</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateConversation.html" data-type="entity-link" >CreateConversation</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateInput.html" data-type="entity-link" >CreateInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreatePost.html" data-type="entity-link" >CreatePost</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateRequest.html" data-type="entity-link" >CreateRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/Current.html" data-type="entity-link" >Current</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeletePost.html" data-type="entity-link" >DeletePost</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteResult.html" data-type="entity-link" >DeleteResult</a>
                            </li>
                            <li class="link">
                                <a href="classes/File.html" data-type="entity-link" >File</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileInfo.html" data-type="entity-link" >FileInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/Friend.html" data-type="entity-link" >Friend</a>
                            </li>
                            <li class="link">
                                <a href="classes/FriendProfile.html" data-type="entity-link" >FriendProfile</a>
                            </li>
                            <li class="link">
                                <a href="classes/FriendsProfile.html" data-type="entity-link" >FriendsProfile</a>
                            </li>
                            <li class="link">
                                <a href="classes/FriendsResolver.html" data-type="entity-link" >FriendsResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetPost.html" data-type="entity-link" >GetPost</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetPosts.html" data-type="entity-link" >GetPosts</a>
                            </li>
                            <li class="link">
                                <a href="classes/GraphQLException.html" data-type="entity-link" >GraphQLException</a>
                            </li>
                            <li class="link">
                                <a href="classes/GraphQLExceptionFilter.html" data-type="entity-link" >GraphQLExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/InfoRequest.html" data-type="entity-link" >InfoRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/InteractPost.html" data-type="entity-link" >InteractPost</a>
                            </li>
                            <li class="link">
                                <a href="classes/IsNonceConstraint.html" data-type="entity-link" >IsNonceConstraint</a>
                            </li>
                            <li class="link">
                                <a href="classes/IsObjectIdConstraint.html" data-type="entity-link" >IsObjectIdConstraint</a>
                            </li>
                            <li class="link">
                                <a href="classes/Like.html" data-type="entity-link" >Like</a>
                            </li>
                            <li class="link">
                                <a href="classes/LikesRepository.html" data-type="entity-link" >LikesRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/LikesResolver.html" data-type="entity-link" >LikesResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListFriendNotInConversation.html" data-type="entity-link" >ListFriendNotInConversation</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginInput.html" data-type="entity-link" >LoginInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginResponse.html" data-type="entity-link" >LoginResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/Message.html" data-type="entity-link" >Message</a>
                            </li>
                            <li class="link">
                                <a href="classes/MessageOmit.html" data-type="entity-link" >MessageOmit</a>
                            </li>
                            <li class="link">
                                <a href="classes/MessagesConversation.html" data-type="entity-link" >MessagesConversation</a>
                            </li>
                            <li class="link">
                                <a href="classes/MessagesResolver.html" data-type="entity-link" >MessagesResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/MongoExceptionFilter.html" data-type="entity-link" >MongoExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/MongooseExceptionFilter.html" data-type="entity-link" >MongooseExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/NotificationsResolver.html" data-type="entity-link" >NotificationsResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/OAuthInfo.html" data-type="entity-link" >OAuthInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/OAuthInput.html" data-type="entity-link" >OAuthInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/Obtain.html" data-type="entity-link" >Obtain</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginationMessages.html" data-type="entity-link" >PaginationMessages</a>
                            </li>
                            <li class="link">
                                <a href="classes/Post.html" data-type="entity-link" >Post</a>
                            </li>
                            <li class="link">
                                <a href="classes/PostDto.html" data-type="entity-link" >PostDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PostsRepository.html" data-type="entity-link" >PostsRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/PostsResolver.html" data-type="entity-link" >PostsResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/Profile.html" data-type="entity-link" >Profile</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProfilesProcessor.html" data-type="entity-link" >ProfilesProcessor</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProfilesResolver.html" data-type="entity-link" >ProfilesResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/Provider.html" data-type="entity-link" >Provider</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProviderInput.html" data-type="entity-link" >ProviderInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/PublisherSubscriptions.html" data-type="entity-link" >PublisherSubscriptions</a>
                            </li>
                            <li class="link">
                                <a href="classes/RedisIoAdapter.html" data-type="entity-link" >RedisIoAdapter</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterResponse.html" data-type="entity-link" >RegisterResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/Request.html" data-type="entity-link" >Request</a>
                            </li>
                            <li class="link">
                                <a href="classes/RequestsResolver.html" data-type="entity-link" >RequestsResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/RetrieveRequest.html" data-type="entity-link" >RetrieveRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/S3Processor.html" data-type="entity-link" >S3Processor</a>
                            </li>
                            <li class="link">
                                <a href="classes/Search.html" data-type="entity-link" >Search</a>
                            </li>
                            <li class="link">
                                <a href="classes/Send.html" data-type="entity-link" >Send</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendFiles.html" data-type="entity-link" >SendFiles</a>
                            </li>
                            <li class="link">
                                <a href="classes/Status.html" data-type="entity-link" >Status</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePost.html" data-type="entity-link" >UpdatePost</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserInput.html" data-type="entity-link" >UserInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/UsersResolver.html" data-type="entity-link" >UsersResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/ValidationExceptionFilter.html" data-type="entity-link" >ValidationExceptionFilter</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AppService.html" data-type="entity-link" >AppService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CommentsService.html" data-type="entity-link" >CommentsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConversationsGateway.html" data-type="entity-link" >ConversationsGateway</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConversationsRepository.html" data-type="entity-link" >ConversationsRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConversationsService.html" data-type="entity-link" >ConversationsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FriendsService.html" data-type="entity-link" >FriendsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HomeMiddleware.html" data-type="entity-link" >HomeMiddleware</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LikesService.html" data-type="entity-link" >LikesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MessagesGateway.html" data-type="entity-link" >MessagesGateway</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MessagesRepository.html" data-type="entity-link" >MessagesRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MessagesService.html" data-type="entity-link" >MessagesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificationsGateway.html" data-type="entity-link" >NotificationsGateway</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificationsService.html" data-type="entity-link" >NotificationsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ObjectIdPipe.html" data-type="entity-link" >ObjectIdPipe</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PostsGateway.html" data-type="entity-link" >PostsGateway</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PostsService.html" data-type="entity-link" >PostsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProfilesGateway.html" data-type="entity-link" >ProfilesGateway</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProfilesRepository.html" data-type="entity-link" >ProfilesRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProfilesService.html" data-type="entity-link" >ProfilesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RequestsGateway.html" data-type="entity-link" >RequestsGateway</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RequestsRepository.html" data-type="entity-link" >RequestsRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RequestsService.html" data-type="entity-link" >RequestsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/Require.html" data-type="entity-link" >Require</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RequireAtLeast.html" data-type="entity-link" >RequireAtLeast</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersRepository.html" data-type="entity-link" >UsersRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersService.html" data-type="entity-link" >UsersService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});