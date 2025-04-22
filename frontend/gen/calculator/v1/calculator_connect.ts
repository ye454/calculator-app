/* eslint-disable */
// @ts-nocheck
import { CalculationRequest, CalculationResponse } from "./calculator";
import type { RpcTransport } from "@connectrpc/connect";
import { createPromiseClient, createServiceImpl } from "@connectrpc/connect";

export const CalculatorService = {
  typeName: "calculator.v1.CalculatorService",
  methods: {
    calculate: {
      name: "Calculate",
      requestType: {} as CalculationRequest,
      responseType: {} as CalculationResponse,
      options: {},
    },
  }
} as const;

export interface CalculatorServiceClient {
  calculate(request: CalculationRequest): Promise<CalculationResponse>;
}

export function createServiceClient(transport: RpcTransport): CalculatorServiceClient {
  return createPromiseClient(CalculatorService, transport);
} 