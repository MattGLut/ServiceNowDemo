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
                    'incident-response-create-acl': {
                        table: 'sys_security_acl'
                        id: 'fc0ae24a621d41f2af509629e5a87834'
                        deleted: true
                    }
                    'incident-response-delete-acl': {
                        table: 'sys_security_acl'
                        id: 'a2ecb86fd39c4694a0a4a87de6397ec2'
                        deleted: true
                    }
                    'incident-response-read-acl': {
                        table: 'sys_security_acl'
                        id: '431b98ae860d42b98486daa0e9525da8'
                        deleted: true
                    }
                    'incident-response-set-responder-br': {
                        table: 'sys_script'
                        id: '550b49d98dfe425e9863964edbf3c702'
                        deleted: true
                    }
                    'incident-response-write-acl': {
                        table: 'sys_security_acl'
                        id: 'c7ca26a801c84a90a018a91683e363d0'
                        deleted: true
                    }
                    package_json: {
                        table: 'sys_module'
                        id: 'f14c2b06cd1244be881bfe999c172a64'
                    }
                    'src_server_business-rules_incident-response-set-responder_server_js': {
                        table: 'sys_module'
                        id: 'edb883bb86cb4ddf8c010c17b6e28540'
                        deleted: true
                    }
                    'src_server_business-rules_ticket-set-submitter_server_js': {
                        table: 'sys_module'
                        id: '0a6c08e453224e78b96183c2e6a8aa29'
                    }
                    'tailwind.generated.css': {
                        table: 'sys_ux_theme_asset'
                        id: 'e93a6c30b37f47e9983f6dc12f76f882'
                        deleted: true
                    }
                    'ticket-create-acl': {
                        table: 'sys_security_acl'
                        id: '6878cb4b1d524380ac56969e01dcafca'
                    }
                    'ticket-delete-acl': {
                        table: 'sys_security_acl'
                        id: '0a54b0ba77e54161aa058d6de5509548'
                    }
                    'ticket-read-acl': {
                        table: 'sys_security_acl'
                        id: '63df6c7a6ca44a9286f61c6c862c9e6c'
                    }
                    'ticket-set-submitter-br': {
                        table: 'sys_script'
                        id: '45806afd788043439ec5cb63c2dcf797'
                    }
                    'ticket-write-acl': {
                        table: 'sys_security_acl'
                        id: 'a7944e1f902b49f1b6436409688f7492'
                    }
                    'workflow-type-ch11': {
                        table: 'x_2058901_demo_workflow_type'
                        id: 'b510ae7a5f8b4a298c7e9630f2065afa'
                    }
                    'workflow-type-create-acl': {
                        table: 'sys_security_acl'
                        id: 'fb1b9997645c4ccc83accc85b07c1db7'
                    }
                    'workflow-type-delete-acl': {
                        table: 'sys_security_acl'
                        id: 'd2af8756a56245dbbe435b1fcf41a0d3'
                    }
                    'workflow-type-read-acl': {
                        table: 'sys_security_acl'
                        id: 'f5800be61c4d4bffb7beeac418046fda'
                    }
                    'workflow-type-write-acl': {
                        table: 'sys_security_acl'
                        id: '11557571477b4adb85ae62368e03f383'
                    }
                }
                composite: [
                    {
                        table: 'sys_security_acl_role'
                        id: '0250698448e14624b3d9d10ea7de0088'
                        key: {
                            sys_security_acl: 'a7944e1f902b49f1b6436409688f7492'
                            sys_user_role: {
                                id: '4c09d527185b43b0be26e620ba60281d'
                                key: {
                                    name: 'itil'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '02d3cb20618d4806a79b0fb15e593d8c'
                        deleted: true
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
                        table: 'sys_security_acl_role'
                        id: '0302ee4e5f0243419c2b0aee1db4b18a'
                        key: {
                            sys_security_acl: '63df6c7a6ca44a9286f61c6c862c9e6c'
                            sys_user_role: {
                                id: '4d6083d3abd74d2f98786cd686d18c27'
                                key: {
                                    name: 'itil'
                                }
                            }
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '03a2634bb3fb4461ad9117fe802a5e3c'
                        key: {
                            application_file: '32b08f7b0bd949839a4b5e581692e760'
                            source_artifact: 'd4573aa5dedc42beb42fcc697b168f65'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '03cb7835826943d7a3141ab88f03637a'
                        deleted: true
                        key: {
                            name: 'x_2058901_demo_incident_response'
                            element: 'response_text'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '05411b01ce4149e0bc9a314c9ee0f976'
                        deleted: true
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
                        deleted: true
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
                        table: 'sys_dictionary'
                        id: '1736dc70c48f4834a6223050f8d9b697'
                        key: {
                            name: 'x_2058901_demo_ticket'
                            element: 'title'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1adc667b4fb647bebeec3056f6b1b80b'
                        key: {
                            name: 'x_2058901_demo_workflow_type'
                            element: 'name'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '201e60d27a3c4ad0b5c041af4e8edff4'
                        key: {
                            application_file: 'd80e72df8380435fb911d316f3d0932c'
                            source_artifact: '7e6f133a2b174248bab52eab426f1024'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '20f18cd7851d4051902c70e5bbbb8912'
                        key: {
                            sys_security_acl: '0a54b0ba77e54161aa058d6de5509548'
                            sys_user_role: {
                                id: '86c2c4d3a8d64b4aa2bb25811eae2b2b'
                                key: {
                                    name: 'itil'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '220d4f05cf2343fa9cd4832733eb6b4e'
                        key: {
                            name: 'x_2058901_demo_ticket'
                            element: 'status'
                            value: 'submitted'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '226516f718ca4737a6cf9d9f9b8b0da0'
                        key: {
                            name: 'x_2058901_demo_ticket'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '2622c28013364fcd8d3f79e597c767af'
                        deleted: true
                        key: {
                            name: 'x_2058901_demo_ticket'
                            element: 'request_type'
                            value: 'document'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '29dc9a653ffe4cef99ea29e7ba0d6fc6'
                        key: {
                            name: 'x_2058901_demo_ticket'
                            element: 'status'
                            value: 'di_processing'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '2a621f3feb5a4f2e98a7cff902092962'
                        key: {
                            sys_security_acl: '11557571477b4adb85ae62368e03f383'
                            sys_user_role: {
                                id: '30e8e38de04a4370beb298164656282f'
                                key: {
                                    name: 'admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2b18d7e0e00a458a86dd798c5509b1b4'
                        key: {
                            name: 'x_2058901_demo_ticket'
                            element: 'stp_flag'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2ba892e0aa4f48078e19c7867985cca4'
                        key: {
                            name: 'x_2058901_demo_workflow_type'
                            element: 'code'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '307426b098cd472aa5eabcf0a264966a'
                        key: {
                            name: 'x_2058901_demo_workflow_type'
                            element: 'code'
                            language: 'en'
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
                        table: 'sys_security_acl_role'
                        id: '338d9734b48e4bf5b76749ef6b757bab'
                        key: {
                            sys_security_acl: 'f5800be61c4d4bffb7beeac418046fda'
                            sys_user_role: {
                                id: '08ae9a355ba840608834918feda903e1'
                                key: {
                                    name: 'itil'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '35ec82e5055e4102b6eb14137f8680b0'
                        deleted: true
                        key: {
                            name: 'x_2058901_demo_ticket'
                            element: 'request_type'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '373346bdf82f48b3b2b9d0aea01c30bd'
                        key: {
                            name: 'x_2058901_demo_ticket'
                            element: 'status'
                            value: 'approved'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3a610496b9fe446898aa43cf49216e9e'
                        key: {
                            name: 'x_2058901_demo_ticket'
                            element: 'submitted_by'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_page'
                        id: '3e2ca4f04b104a759892c88968ebd34a'
                        key: {
                            endpoint: 'x_2058901_demo_ticket_submit.do'
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
                        table: 'sys_ui_page'
                        id: '41700b2561fb49a18b7b231f1033ff68'
                        key: {
                            endpoint: 'x_2058901_demo_ticket_view.do'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '44dc1b5455e2487293adf81de434df29'
                        deleted: true
                        key: {
                            name: 'x_2058901_demo_incident_response'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '45f4dacbd985426a88a5e7f479bc337d'
                        key: {
                            name: 'x_2058901_demo_workflow_type'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '47d9d27bd8a94524a94ef3335b2df068'
                        deleted: true
                        key: {
                            name: 'x_2058901_demo_ticket'
                            element: 'request_type'
                            value: 'pickup'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '48ec9aab3c774597898d23bfd79a647e'
                        deleted: true
                        key: {
                            name: 'x_2058901_demo_incident_response'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '505c09be37c6499582eebb2547959ff4'
                        key: {
                            sys_security_acl: '6878cb4b1d524380ac56969e01dcafca'
                            sys_user_role: {
                                id: '575f59b4c2684e0dbd45dcb922b2c7f7'
                                key: {
                                    name: 'itil'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '54ee7defc02f4a65ba27ce2d0b17334a'
                        key: {
                            name: 'x_2058901_demo_ticket'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '552c8c85ceeb454b86393e1419437a95'
                        key: {
                            name: 'x_2058901_demo_ticket'
                            element: 'workflow_type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5de2525ea82b45e2a9dab8efea0e911c'
                        key: {
                            name: 'x_2058901_demo_ticket'
                            element: 'stp_flag'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5f7469326a074acf9fd993f581f83bd4'
                        deleted: true
                        key: {
                            name: 'x_2058901_demo_ticket'
                            element: 'request_type'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6032e7d333674222aa32a42429936489'
                        deleted: true
                        key: {
                            name: 'x_2058901_demo_incident_response'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '6660e9234e1e438aa684440f8ee84d36'
                        deleted: true
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
                        table: 'sn_glider_source_artifact_m2m'
                        id: '6b2cee5dc541487085028f905ce48897'
                        key: {
                            application_file: 'd80e72df8380435fb911d316f3d0932c'
                            source_artifact: 'a1c9c0e91e3b4900a70cb087471b578a'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6d3c2eecf1d24467a978ad50cba38e70'
                        key: {
                            name: 'x_2058901_demo_ticket'
                            element: 'description'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '6ed98245cc254549add311d2628a899c'
                        key: {
                            sys_security_acl: 'fb1b9997645c4ccc83accc85b07c1db7'
                            sys_user_role: {
                                id: '3b457666883249b2a9f4245f77e39168'
                                key: {
                                    name: 'admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '7537acc3d5e84644b892f8765b35b821'
                        key: {
                            application_file: '32b08f7b0bd949839a4b5e581692e760'
                            source_artifact: '7e6f133a2b174248bab52eab426f1024'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '7e47340324a2446388d99538dbea258c'
                        key: {
                            name: 'x_2058901_demo_ticket'
                            element: 'status'
                            value: 'picked_up'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact'
                        id: '7e6f133a2b174248bab52eab426f1024'
                        key: {
                            name: 'x_2058901_demo_ticket_view.do - BYOUI Files'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7e7f01a7c6d543a69fb67b60f494a374'
                        key: {
                            name: 'x_2058901_demo_ticket'
                            element: 'title'
                            language: 'en'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '8e8b80511ef94d9985ce4f8754c2513d'
                        key: {
                            name: 'x_2058901_demo_ticket'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '93e5e1be2459422d8ebeb66f058adfff'
                        deleted: true
                        key: {
                            name: 'x_2058901_demo_incident_response'
                            element: 'responded_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '99a2de24807f41ef8c2a5bb624b06c7f'
                        key: {
                            name: 'x_2058901_demo_ticket'
                            element: 'workflow_type'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9be1ce0a32604c7b8644a99acbf2ac96'
                        key: {
                            name: 'x_2058901_demo_ticket'
                            element: 'submitted_by'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'a01dc012ba63455ca58361caa05b8046'
                        key: {
                            application_file: '32b08f7b0bd949839a4b5e581692e760'
                            source_artifact: 'a1c9c0e91e3b4900a70cb087471b578a'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a1978ea086384e35bc61c3edb4d56b0e'
                        key: {
                            name: 'x_2058901_demo_workflow_type'
                            element: 'name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact'
                        id: 'a1c9c0e91e3b4900a70cb087471b578a'
                        key: {
                            name: 'x_2058901_demo_ticket_submit.do - BYOUI Files'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a1f1131742e54f66a2d01f9e49330c6e'
                        key: {
                            name: 'x_2058901_demo_ticket'
                            element: 'external_id'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'a24f28e5994d4bd1ac85ae83c7294db5'
                        key: {
                            name: 'x_2058901_demo_workflow_type'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a298ba6b860d46ed84e039c041c3c197'
                        deleted: true
                        key: {
                            name: 'x_2058901_demo_ticket'
                            element: 'request_type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'a4337dd28c624132a983efade058e8a5'
                        key: {
                            application_file: 'f18c6187b53b4ddaa8ba01cdfd0eb96e'
                            source_artifact: 'd4573aa5dedc42beb42fcc697b168f65'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'a6b1b8b94d864205a1d2cf2435bdb029'
                        key: {
                            application_file: '3e2ca4f04b104a759892c88968ebd34a'
                            source_artifact: 'a1c9c0e91e3b4900a70cb087471b578a'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'a6d5dab092a54105a06378359c6a4414'
                        key: {
                            name: 'x_2058901_demo_workflow_type'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a85c9aaedaa74eb1837891c44ff6c390'
                        deleted: true
                        key: {
                            name: 'x_2058901_demo_incident_response'
                            element: 'responded_by'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'a92a05693c644f8588699b067e3e1be4'
                        key: {
                            application_file: '41700b2561fb49a18b7b231f1033ff68'
                            source_artifact: '7e6f133a2b174248bab52eab426f1024'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'aaa95c52ce4c437fbb1962bd79915d76'
                        deleted: true
                        key: {
                            name: 'x_2058901_demo_incident_response'
                            element: 'incident'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'b02485d9442d471380eefca196cec11d'
                        key: {
                            name: 'x_2058901_demo_ticket'
                            element: 'status'
                            value: 'stp_queued'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'b41c3f8364d24e0baac33ef55ecf4b3e'
                        key: {
                            sys_security_acl: 'd2af8756a56245dbbe435b1fcf41a0d3'
                            sys_user_role: {
                                id: 'b6fcfd136df74006b839ddda201db43d'
                                key: {
                                    name: 'admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b6c6a9b58d104c7abecbcb927da433f6'
                        key: {
                            name: 'x_2058901_demo_ticket'
                            element: 'description'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b90c3b76c25b47eea85f90ea8c5a8724'
                        key: {
                            name: 'x_2058901_demo_ticket'
                            element: 'external_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'bc7a43cea46342e58f6ee092e4a8b661'
                        deleted: true
                        key: {
                            name: 'x_2058901_demo_ticket'
                            element: 'request_type'
                            value: 'general'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'bea67a8e39de46068a8611ae5762352b'
                        key: {
                            name: 'x_2058901_demo_ticket'
                            element: 'status'
                            value: 'ready_for_pickup'
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
                        deleted: true
                        key: {
                            name: 'x_2058901_demo_incident_response'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c809fee7af5a4f11b8410d8468e9f3f7'
                        deleted: true
                        key: {
                            name: 'x_2058901_demo_incident_response'
                            element: 'responded_by'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'c940b0cdecd04a6e9f6b945c530deb77'
                        key: {
                            application_file: 'd80e72df8380435fb911d316f3d0932c'
                            source_artifact: 'd4573aa5dedc42beb42fcc697b168f65'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact'
                        id: 'd4573aa5dedc42beb42fcc697b168f65'
                        key: {
                            name: 'x_2058901_demo_ticket_list.do - BYOUI Files'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'd5fcd53405b24cefbf2f449dd565b1c5'
                        key: {
                            name: 'x_2058901_demo_ticket'
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
                        table: 'sys_choice'
                        id: 'd8eae10b0d434434b1c6d8bc7d943bf0'
                        key: {
                            name: 'x_2058901_demo_ticket'
                            element: 'status'
                            value: 'pending_review'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'dd7d74a7050b45d5a361471b92febc20'
                        key: {
                            name: 'x_2058901_demo_ticket'
                            element: 'status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'dde6b1a592154a7aab487cbefa91469a'
                        deleted: true
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
                        table: 'sys_documentation'
                        id: 'f0b1165f65aa49dead7ae64dd29642f8'
                        key: {
                            name: 'x_2058901_demo_workflow_type'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f11a0f01e6014a5784835037cff71b52'
                        deleted: true
                        key: {
                            name: 'x_2058901_demo_incident_response'
                            element: 'responded_at'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f1394501569147abb30b7b4a03181a14'
                        key: {
                            name: 'x_2058901_demo_ticket'
                            element: 'submitted_at'
                        }
                    },
                    {
                        table: 'sys_ui_page'
                        id: 'f18c6187b53b4ddaa8ba01cdfd0eb96e'
                        key: {
                            endpoint: 'x_2058901_demo_ticket_list.do'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'f327b1aa137a4a7b946b2508d37958c1'
                        deleted: true
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
                        table: 'sys_dictionary'
                        id: 'f6d8da1e4e284779b22f157651f73235'
                        key: {
                            name: 'x_2058901_demo_ticket'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'f795114ba67b46f4bca90db522dbd8f8'
                        key: {
                            name: 'x_2058901_demo_ticket'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'fc7d1d43b6e14c158a38f2fe94f08273'
                        key: {
                            name: 'x_2058901_demo_ticket'
                            element: 'submitted_at'
                            language: 'en'
                        }
                    },
                ]
            }
        }
    }
}
