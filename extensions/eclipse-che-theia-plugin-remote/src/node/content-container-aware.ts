/*********************************************************************
 * Copyright (c) 2018-2019 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import { DocumentsExtImpl } from '@theia/plugin-ext/lib/plugin/documents';
import URI from 'vscode-uri';

export class ContentContainerAware {

    overrideShowDocument(documentExt: DocumentsExtImpl) {
        const originalShowDocument = documentExt.showDocument.bind(documentExt);

        const showDocument = (uri: URI) => {
            if (!uri.path.startsWith('/projects')) {
                const newScheme = 'file-sidecar-' + process.env.CHE_MACHINE_NAME;
                uri = uri.with({ scheme: newScheme });
            }
            return originalShowDocument(uri);
        };

        documentExt.showDocument = showDocument;
    }
}
