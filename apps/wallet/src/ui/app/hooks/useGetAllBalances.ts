// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useFeatureValue } from '@growthbook/growthbook-react';
import { useRpcClient } from '@mysten/core';
import { Coin, type SuiAddress } from '@mysten/sui.js';
import { useQuery } from '@tanstack/react-query';

import { FEATURES } from '_src/shared/experimentation/features';

export function useGetAllBalances(address?: SuiAddress | null) {
    const rpc = useRpcClient();
    const refetchInterval = useFeatureValue(
        FEATURES.WALLET_BALANCE_REFETCH_INTERVAL,
        20_000
    );

    return useQuery({
        queryKey: ['get-all-balance', address],
        queryFn: async () => await rpc.getAllBalances({ owner: address! }),
        select: (data) =>
            [...data].sort(({ coinType: a }, { coinType: b }) =>
                Coin.getCoinSymbol(a).localeCompare(Coin.getCoinSymbol(b))
            ),
        enabled: !!address,
        refetchInterval,
        staleTime: 5_000,
    });
}