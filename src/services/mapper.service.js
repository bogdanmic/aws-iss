'use strict'

const doorman = require('./doorman.service')

exports.mapEC2Instances = async (data) => {
    // Call EC2 to retrieve policy for selected bucket
    return data.Reservations
        .map(el => el.Instances[0])
        .map(toEC2Object);
}

exports.mapRDSInstances = async (data) => {
    // Call EC2 to retrieve policy for selected bucket
    return data.DBInstances
        .map(toRDSObject);
}

function toEC2Object(o) {
    return {
        InstanceId: o.InstanceId,
        InstanceType: o.InstanceType,
        PrivateIpAddress: o.PrivateIpAddress,
        PublicDnsName: o.PublicDnsName,
        State: o.State.Name,
        // StateReason: o.StateReason ? o.StateReason.Message : "",
        Name: o.Tags.find(e => e.Key === "Name").Value,
        CpuOptions: o.CpuOptions,
        isInteractive: doorman.isEC2InstanceInteractive(o.InstanceId),
        // raw: o
    }
}

function toRDSObject(o) {
    return {
        DBInstanceIdentifier: o.DBInstanceIdentifier,
        DBInstanceClass: o.DBInstanceClass,
        Engine: o.Engine + " " + o.EngineVersion,
        DBInstanceStatus: o.DBInstanceStatus,
        Endpoint: o.Endpoint.Address,
        AllocatedStorage: o.AllocatedStorage ? o.AllocatedStorage + "GB" : "",
        isInteractive: doorman.isRDSInstanceInteractive(o.DBInstanceIdentifier),
        // raw: o
    }
}