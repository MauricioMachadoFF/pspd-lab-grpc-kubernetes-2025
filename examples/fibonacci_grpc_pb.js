// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var fibonacci_pb = require('./fibonacci_pb.js');

function serialize_fibonacci_FibonacciRequest(arg) {
  if (!(arg instanceof fibonacci_pb.FibonacciRequest)) {
    throw new Error('Expected argument of type fibonacci.FibonacciRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_fibonacci_FibonacciRequest(buffer_arg) {
  return fibonacci_pb.FibonacciRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_fibonacci_FibonacciResponse(arg) {
  if (!(arg instanceof fibonacci_pb.FibonacciResponse)) {
    throw new Error('Expected argument of type fibonacci.FibonacciResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_fibonacci_FibonacciResponse(buffer_arg) {
  return fibonacci_pb.FibonacciResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var FibonacciService = exports.FibonacciService = {
  generateSequence: {
    path: '/fibonacci.Fibonacci/GenerateSequence',
    requestStream: false,
    responseStream: true,
    requestType: fibonacci_pb.FibonacciRequest,
    responseType: fibonacci_pb.FibonacciResponse,
    requestSerialize: serialize_fibonacci_FibonacciRequest,
    requestDeserialize: deserialize_fibonacci_FibonacciRequest,
    responseSerialize: serialize_fibonacci_FibonacciResponse,
    responseDeserialize: deserialize_fibonacci_FibonacciResponse,
  },
};

exports.FibonacciClient = grpc.makeGenericClientConstructor(FibonacciService, 'Fibonacci');
