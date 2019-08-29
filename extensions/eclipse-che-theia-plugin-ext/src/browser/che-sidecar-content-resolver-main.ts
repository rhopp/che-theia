/*********************************************************************
 * Copyright (c) 2018 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/
import { RPCProtocol } from '@theia/plugin-ext/lib/common/rpc-protocol';
import { interfaces } from 'inversify';
import { CheSideCarContentResolverMain } from '../common/che-protocol';

export class CheSideCarContentResolverMainImpl implements CheSideCarContentResolverMain {
    // private readonly delegate: CheSideCarContentResolver;
    // private readonly registry: CheSideCarContentReaderRegistry;

    constructor(container: interfaces.Container, rpc: RPCProtocol) {
        // this.delegate = rpc.getProxy(PLUGIN_RPC_CONTEXT.CHE_SIDERCAR_CONTENT_RESOLVER);
        // this.registry = container.get(CheSideCarContentReaderRegistry);
    }

    async $registerContentResolver(scheme: string): Promise<void> {
        // this.registry.register(scheme, async (uri, options?: { encoding?: string }) => await this.delegate.$resolveContent(uri, options));
    }
}
