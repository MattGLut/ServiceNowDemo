var MapContractToApproval = Class.create()
MapContractToApproval.prototype = {
    initialize: function () {},

    getContractString: function (contract, name) {
        if (!contract || !name) {
            return ''
        }
        var value = contract[name]
        if (value === null || value === undefined) {
            return ''
        }
        return String(value).trim()
    },

    setMappedValue: function (values, column, value) {
        if (value) {
            values[column] = value
        }
    },

    pickContract: function (contracts, requestedContractNo) {
        if (!contracts || !contracts.length) {
            return null
        }

        if (contracts.length === 1) {
            return contracts[0]
        }

        var requested = (requestedContractNo || '').trim()
        if (!requested) {
            return contracts[0]
        }

        for (var i = 0; i < contracts.length; i++) {
            var contractNo = this.getContractString(contracts[i], 'contractNo')
            if (contractNo && contractNo === requested) {
                return contracts[i]
            }
        }

        return contracts[0]
    },

    mapContract: function (contract) {
        var values = {}

        if (!contract) {
            return { values: values }
        }

        this.setMappedValue(values, 'company_code', this.getContractString(contract, 'companyCode'))
        this.setMappedValue(values, 'profit_center', this.getContractString(contract, 'profitCenter'))
        this.setMappedValue(values, 'approver_name', this.getContractString(contract, 'approverName'))
        this.setMappedValue(values, 'approver_id', this.getContractString(contract, 'approverId'))
        this.setMappedValue(
            values,
            'payment_method',
            this.getContractString(contract, 'purchasePaymentMethod')
        )
        this.setMappedValue(
            values,
            'charge_payee_id',
            this.getContractString(contract, 'vendorOrCreditorId')
        )
        this.setMappedValue(
            values,
            'charge_payee_name',
            this.getContractString(contract, 'vendorOrCreditorName')
        )
        this.setMappedValue(
            values,
            'invoicing_party_id',
            this.getContractString(contract, 'vendorOrCreditorId')
        )

        return { values: values }
    },

    mapContracts: function (contracts, requestedContractNo) {
        var contract = this.pickContract(contracts, requestedContractNo)
        return this.mapContract(contract)
    },

    type: 'MapContractToApproval',
}
