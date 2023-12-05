import type { OnRpcRequestHandler } from '@metamask/snaps-sdk';
import { panel, text } from '@metamask/snaps-sdk';
import ethers from 'ethers';

async function getFees() {
  const response = await fetch('https://beaconcha.in/api/v1/execution/gasnow'); 
  console.log(response)
  return response.text();
}

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
  switch (request.method) {
    case 'hello':
      return getFees().then(fees => {
        return snap.request({
          method: 'snap_dialog',
          params: {
            type: 'alert',
            content: panel([
              text(`Hello, **${origin}**!`),
              text(`Current gas fee estimates`),
              text(`Rapid: ${((JSON.parse(fees).data.rapid) * 0.000000001).toFixed(2).toString()} gwei`),
              text(`Fast: ${((JSON.parse(fees).data.fast) * 0.000000001).toFixed(2).toString()} gwei`),
              text(`Standard: ${((JSON.parse(fees).data.standard) * 0.000000001).toFixed(2).toString()} gwei`),

            ]),
          }
        });
      });
    default:
      throw new Error('Method not found.');
  }
};
