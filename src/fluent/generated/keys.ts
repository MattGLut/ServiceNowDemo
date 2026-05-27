import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    bom_json: {
                        table: 'sys_module'
                        id: '0e3749029e224d5c8dffa70f9824870f'
                    }
                    'incident-complaint-create-acl': {
                        table: 'sys_security_acl'
                        id: '5044c5d24ca54a67808cee781e055561'
                    }
                    'incident-complaint-delete-acl': {
                        table: 'sys_security_acl'
                        id: 'bb4a7b09b3f64f1dbf242c8ff0e01456'
                    }
                    'incident-complaint-read-acl': {
                        table: 'sys_security_acl'
                        id: '840b8f0197a84f1daf794741909d6237'
                    }
                    'incident-complaint-set-filer-br': {
                        table: 'sys_script'
                        id: '1504919e0062429bb44d5d43ffbf94ec'
                    }
                    'incident-complaint-write-acl': {
                        table: 'sys_security_acl'
                        id: 'd1d47b3badef40198e03d2d143899689'
                    }
                    'incident-response-create-acl': {
                        table: 'sys_security_acl'
                        id: 'fc0ae24a621d41f2af509629e5a87834'
                    }
                    'incident-response-delete-acl': {
                        table: 'sys_security_acl'
                        id: 'a2ecb86fd39c4694a0a4a87de6397ec2'
                    }
                    'incident-response-read-acl': {
                        table: 'sys_security_acl'
                        id: '431b98ae860d42b98486daa0e9525da8'
                    }
                    'incident-response-set-responder-br': {
                        table: 'sys_script'
                        id: '550b49d98dfe425e9863964edbf3c702'
                    }
                    'incident-response-write-acl': {
                        table: 'sys_security_acl'
                        id: 'c7ca26a801c84a90a018a91683e363d0'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: 'f14c2b06cd1244be881bfe999c172a64'
                    }
                    'src_server_business-rules_incident-complaint-set-filer_server_js': {
                        table: 'sys_module'
                        id: '014a1c7a94474ca7a5475485ff3b895c'
                    }
                    'src_server_business-rules_incident-response-set-responder_server_js': {
                        table: 'sys_module'
                        id: 'edb883bb86cb4ddf8c010c17b6e28540'
                    }
                    'tailwind.generated.css': {
                        table: 'sys_ux_theme_asset'
                        id: 'e93a6c30b37f47e9983f6dc12f76f882'
                        deleted: true
                    }
                }
                composite: [
                    {
                        table: 'sys_security_acl_role'
                        id: '02d3cb20618d4806a79b0fb15e593d8c'
                        key: {
                            sys_security_acl: 'fc0ae24a621d41f2af509629e5a87834'
                            sys_user_role: {
                                id: 'acd5f572647a4a7ebe52e0886d66308f'
                                key: {
                                    name: 'itil'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '03cb7835826943d7a3141ab88f03637a'
                        key: {
                            name: 'x_2058901_demo_incident_response'
                            element: 'response_text'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '05411b01ce4149e0bc9a314c9ee0f976'
                        key: {
                            sys_security_acl: '431b98ae860d42b98486daa0e9525da8'
                            sys_user_role: {
                                id: '83620482a1a74cf1aca7ed8836abab87'
                                key: {
                                    name: 'itil'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0a0a3f51a367461f98a22d589dabbef7'
                        key: {
                            name: 'x_2058901_demo_incident_response'
                            element: 'response_text'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact'
                        id: '0d3c23bf918c45878e4ea9f11dceb6ea'
                        key: {
                            name: 'x_2058901_demo_incident_manager.do - BYOUI Files'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '32b08f7b0bd949839a4b5e581692e760'
                        key: {
                            name: 'x_2058901_demo/main'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '39d9e0bd5aa148a78ae20a8a3c7b9d6b'
                        key: {
                            name: 'x_2058901_demo_incident_complaint'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '3ea13875f30443a4b8f172e0390fde83'
                        key: {
                            application_file: 'd80e72df8380435fb911d316f3d0932c'
                            source_artifact: '0d3c23bf918c45878e4ea9f11dceb6ea'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '44dc1b5455e2487293adf81de434df29'
                        key: {
                            name: 'x_2058901_demo_incident_response'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '48ec9aab3c774597898d23bfd79a647e'
                        key: {
                            name: 'x_2058901_demo_incident_response'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '560e13965915426883d95f5a07e408e3'
                        key: {
                            name: 'x_2058901_demo_incident_complaint'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5c245f8977b745a28bc4926530413d47'
                        key: {
                            name: 'x_2058901_demo_incident_complaint'
                            element: 'filed_at'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5e4502e2a4b245fca331920257e092b0'
                        key: {
                            name: 'x_2058901_demo_incident_complaint'
                            element: 'incident'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6032e7d333674222aa32a42429936489'
                        key: {
                            name: 'x_2058901_demo_incident_response'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '6660e9234e1e438aa684440f8ee84d36'
                        key: {
                            sys_security_acl: 'c7ca26a801c84a90a018a91683e363d0'
                            sys_user_role: {
                                id: '131acd617cb0423194259ba6ecb85cc9'
                                key: {
                                    name: 'itil'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '747cfab0ecfa44c792934a190bd67b3a'
                        key: {
                            sys_security_acl: '5044c5d24ca54a67808cee781e055561'
                            sys_user_role: {
                                id: '1bc3de7c762d4ef48540530b8ff6a676'
                                key: {
                                    name: 'itil'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '832117e7dd8540198c142274ffa8ccbb'
                        key: {
                            name: 'x_2058901_demo_incident_complaint'
                            element: 'complaint_text'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '93e5e1be2459422d8ebeb66f058adfff'
                        key: {
                            name: 'x_2058901_demo_incident_response'
                            element: 'responded_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '97e1a975037f4fcca2b4804d6a79465f'
                        key: {
                            name: 'x_2058901_demo_incident_complaint'
                            element: 'filed_by'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '9f99562bacb34af8937b2ddab7fb634f'
                        key: {
                            sys_security_acl: 'bb4a7b09b3f64f1dbf242c8ff0e01456'
                            sys_user_role: {
                                id: '944930a639bc4508b8af7cb3d761fa00'
                                key: {
                                    name: 'itil'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a85c9aaedaa74eb1837891c44ff6c390'
                        key: {
                            name: 'x_2058901_demo_incident_response'
                            element: 'responded_by'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'aaa95c52ce4c437fbb1962bd79915d76'
                        key: {
                            name: 'x_2058901_demo_incident_response'
                            element: 'incident'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'beb44a9246044d558e207651448e833e'
                        key: {
                            name: 'x_2058901_demo_incident_complaint'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_page'
                        id: 'bff39ae26b7b4e5793ddc92c987a0121'
                        key: {
                            endpoint: 'x_2058901_demo_incident_manager.do'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'c13a24931eb443e286d92385cdac0c44'
                        key: {
                            name: 'x_2058901_demo_incident_response'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c809fee7af5a4f11b8410d8468e9f3f7'
                        key: {
                            name: 'x_2058901_demo_incident_response'
                            element: 'responded_by'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'd72190c446ad4d288e96e3728e184cb0'
                        key: {
                            application_file: '32b08f7b0bd949839a4b5e581692e760'
                            source_artifact: '0d3c23bf918c45878e4ea9f11dceb6ea'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: 'd80e72df8380435fb911d316f3d0932c'
                        key: {
                            name: 'x_2058901_demo/main.js.map'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'dc93b3e53a6d463ba1dc01e46ccc357b'
                        key: {
                            name: 'x_2058901_demo_incident_complaint'
                            element: 'filed_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'dde30dce176745f4920ab118cc5fb29d'
                        key: {
                            sys_security_acl: '840b8f0197a84f1daf794741909d6237'
                            sys_user_role: {
                                id: '6b44259233f443d4b255d36536b01038'
                                key: {
                                    name: 'itil'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'dde6b1a592154a7aab487cbefa91469a'
                        key: {
                            name: 'x_2058901_demo_incident_response'
                            element: 'incident'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'e094d28cc5e34249b092390e2992ecee'
                        key: {
                            application_file: 'bff39ae26b7b4e5793ddc92c987a0121'
                            source_artifact: '0d3c23bf918c45878e4ea9f11dceb6ea'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e3af8e563d1a4ab4a4eba5ddd14c7f9a'
                        key: {
                            name: 'x_2058901_demo_incident_complaint'
                            element: 'incident'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e8830a42d5714c9eae75811a4b0677b3'
                        key: {
                            name: 'x_2058901_demo_incident_complaint'
                            element: 'complaint_text'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'f07df702987c40b8a15bbfcc798931d5'
                        key: {
                            sys_security_acl: 'd1d47b3badef40198e03d2d143899689'
                            sys_user_role: {
                                id: '23a11b7b045f4dbdbf53dde43b569089'
                                key: {
                                    name: 'itil'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f11a0f01e6014a5784835037cff71b52'
                        key: {
                            name: 'x_2058901_demo_incident_response'
                            element: 'responded_at'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'f327b1aa137a4a7b946b2508d37958c1'
                        key: {
                            sys_security_acl: 'a2ecb86fd39c4694a0a4a87de6397ec2'
                            sys_user_role: {
                                id: '58a961b8f0c744138e78968d9e7d7a0f'
                                key: {
                                    name: 'itil'
                                }
                            }
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'fbd4a26856784e9dbe06d1c90cd69b66'
                        key: {
                            name: 'x_2058901_demo_incident_complaint'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ffe5215ea3604b99b4bdf65fca79db6f'
                        key: {
                            name: 'x_2058901_demo_incident_complaint'
                            element: 'filed_by'
                            language: 'en'
                        }
                    },
                ]
            }
        }
    }
}
