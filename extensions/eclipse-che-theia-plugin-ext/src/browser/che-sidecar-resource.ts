/********************************************************************************
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { Resource, ResourceResolver } from '@theia/core/lib/common/resource';
import URI from '@theia/core/lib/common/uri';
import { inject, injectable } from 'inversify';
import { CheSideCarContentReaderRegistry, ContentReaderFunc } from '../common/che-protocol';

export class CheSideCarResource implements Resource {
    constructor(
        public uri: URI,
        protected readonly reader: ContentReaderFunc) { }

    dispose(): void { }

    async readContents(options?: { encoding?: string }): Promise<string> {
        return this.reader(this.uri.toString(), options);
    }
}

@injectable()
export class CheSideCarContentReaderRegistryImpl implements CheSideCarContentReaderRegistry {
    protected readonly readers = new Map<string, ContentReaderFunc>();

    register(scheme: string, f: ContentReaderFunc): void {
        this.readers.set(scheme, f);
    }

    unregister(scheme: string): void {
        this.readers.delete(scheme);
    }

    get(scheme: string): ContentReaderFunc | undefined {
        return this.readers.get(scheme);
    }
}

@injectable()
export class CheSideCarResourceResolver implements ResourceResolver {

    @inject(CheSideCarContentReaderRegistry)
    protected readonly registry: CheSideCarContentReaderRegistry;

    static SCHEME = 'file-sidecar';
    async resolve(uri: URI): Promise<CheSideCarResource> {
        if (uri.scheme.startsWith(CheSideCarResourceResolver.SCHEME)) {
            throw new Error('The given URI is not a valid side-car resource URI: ' + uri);
        }

        const reader = this.registry.get(uri.scheme);
        if (!reader) {
            throw new Error(`Side car content reader not found for '${uri.scheme}' scheme`);
        }

        return new CheSideCarResource(uri, reader);
    }
}
