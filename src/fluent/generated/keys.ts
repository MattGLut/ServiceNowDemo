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
                    package_json: {
                        table: 'sys_module'
                        id: 'f14c2b06cd1244be881bfe999c172a64'
                    }
                }
                composite: [
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
                        table: 'sn_glider_source_artifact_m2m'
                        id: '3ea13875f30443a4b8f172e0390fde83'
                        key: {
                            application_file: 'd80e72df8380435fb911d316f3d0932c'
                            source_artifact: '0d3c23bf918c45878e4ea9f11dceb6ea'
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
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'e094d28cc5e34249b092390e2992ecee'
                        key: {
                            application_file: 'bff39ae26b7b4e5793ddc92c987a0121'
                            source_artifact: '0d3c23bf918c45878e4ea9f11dceb6ea'
                        }
                    },
                ]
            }
        }
    }
}
