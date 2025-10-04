// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var calculadora_pb = require('./calculadora_pb.js');

function serialize_calculator_BinaryOpRequest(arg) {
  if (!(arg instanceof calculadora_pb.BinaryOpRequest)) {
    throw new Error('Expected argument of type calculator.BinaryOpRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_calculator_BinaryOpRequest(buffer_arg) {
  return calculadora_pb.BinaryOpRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_calculator_CalculatorResponse(arg) {
  if (!(arg instanceof calculadora_pb.CalculatorResponse)) {
    throw new Error('Expected argument of type calculator.CalculatorResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_calculator_CalculatorResponse(buffer_arg) {
  return calculadora_pb.CalculatorResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var CalculatorService = exports.CalculatorService = {
  sum: {
    path: '/calculator.Calculator/Sum',
    requestStream: false,
    responseStream: false,
    requestType: calculadora_pb.BinaryOpRequest,
    responseType: calculadora_pb.CalculatorResponse,
    requestSerialize: serialize_calculator_BinaryOpRequest,
    requestDeserialize: deserialize_calculator_BinaryOpRequest,
    responseSerialize: serialize_calculator_CalculatorResponse,
    responseDeserialize: deserialize_calculator_CalculatorResponse,
  },
  subtract: {
    path: '/calculator.Calculator/Subtract',
    requestStream: false,
    responseStream: false,
    requestType: calculadora_pb.BinaryOpRequest,
    responseType: calculadora_pb.CalculatorResponse,
    requestSerialize: serialize_calculator_BinaryOpRequest,
    requestDeserialize: deserialize_calculator_BinaryOpRequest,
    responseSerialize: serialize_calculator_CalculatorResponse,
    responseDeserialize: deserialize_calculator_CalculatorResponse,
  },
};

exports.CalculatorClient = grpc.makeGenericClientConstructor(CalculatorService, 'Calculator');
