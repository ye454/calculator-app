/* eslint-disable */
// @ts-nocheck
import type { PartialMessage } from "@bufbuild/protobuf";

/**
 * @generated from message calculator.v1.CalculationRequest
 */
export interface CalculationRequest {
  a: number;
  b: number;
  op: string;
}

/**
 * @generated from message calculator.v1.CalculationResponse
 */
export interface CalculationResponse {
  result: number;
} 