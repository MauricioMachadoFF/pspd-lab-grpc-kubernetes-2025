// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var average_pb = require('./average_pb.js');

function serialize_average_AverageRequest(arg) {
  if (!(arg instanceof average_pb.AverageRequest)) {
    throw new Error('Expected argument of type average.AverageRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_average_AverageRequest(buffer_arg) {
  return average_pb.AverageRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_average_AverageResponse(arg) {
  if (!(arg instanceof average_pb.AverageResponse)) {
    throw new Error('Expected argument of type average.AverageResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_average_AverageResponse(buffer_arg) {
  return average_pb.AverageResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var AverageCalculatorService = exports.AverageCalculatorService = {
  calculateAverage: {
    path: '/average.AverageCalculator/CalculateAverage',
    requestStream: true,
    responseStream: false,
    requestType: average_pb.AverageRequest,
    responseType: average_pb.AverageResponse,
    requestSerialize: serialize_average_AverageRequest,
    requestDeserialize: deserialize_average_AverageRequest,
    responseSerialize: serialize_average_AverageResponse,
    responseDeserialize: deserialize_average_AverageResponse,
  },
};

exports.AverageCalculatorClient = grpc.makeGenericClientConstructor(AverageCalculatorService, 'AverageCalculator');
