/*********************************************************************
 * Copyright (c) 2018-2019 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import * as theia from '@theia/plugin';
import { DocumentsExtImpl } from '@theia/plugin-ext/lib/plugin/documents';
import URI from 'vscode-uri';

export class DocumentContainerAware {

    static makeDocumentContainerAware(documentExt: DocumentsExtImpl): void {
        const documentContainerAware = new DocumentContainerAware();
        documentContainerAware.overrideGetDocumentData(documentExt);
        documentContainerAware.overrideShowDocument(documentExt);
        documentContainerAware.overrideOpenDocument(documentExt);
    }

    overrideOpenDocument(documentExt: DocumentsExtImpl) {
        const originalOpenDocument = documentExt.openDocument.bind(documentExt);
        const openDocument = (uri: URI) => originalOpenDocument(this.overrideUri(uri));
        documentExt.openDocument = openDocument;
    }

    overrideShowDocument(documentExt: DocumentsExtImpl) {
        const originalShowDocument = documentExt.showDocument.bind(documentExt);
        const showDocument = (uri: URI, options?: theia.TextDocumentShowOptions) => originalShowDocument(this.overrideUri(uri), options);
        documentExt.showDocument = showDocument;
    }

    overrideGetDocumentData(documentExt: DocumentsExtImpl) {
        const originalGetDocumentData = documentExt.getDocumentData.bind(documentExt);
        const getDocumentData = (resource: theia.Uri) => originalGetDocumentData(this.overrideUri(resource));
        documentExt.getDocumentData = getDocumentData;
    }

    private overrideUri(uri: URI | theia.Uri) {
        if (!uri.path.startsWith('/projects')) {
            const newScheme = 'file-sidecar-' + process.env.CHE_MACHINE_NAME;
            uri = uri.with({ scheme: newScheme });

            console.info(`Request to ${arguments.callee.caller.toString()} is overridden with the new uri ${uri.toString}`);
        }
        return uri;
    }
}
