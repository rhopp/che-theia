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

    static makeDocumentContainerAware(documentExt: DocumentsExtImpl) {
        const documentContainerAware = new DocumentContainerAware();
        documentContainerAware.overrideGetDocumentData(documentExt);
        documentContainerAware.overrideOpenDocument(documentExt);
        documentContainerAware.overrideShowDocument(documentExt);
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

    overrideResult(result: theia.Location | theia.DefinitionLink): void {
        if (result instanceof theia.Location) {
            result.uri = this.overrideUri(result.uri);
        } else {
            result.targetUri = this.overrideUri(result.targetUri);
        }
    }

    private overrideUri(uri: URI | theia.Uri) {
        if (!uri.path.startsWith('/projects')) {
            const newScheme = 'file-sidecar-' + process.env.CHE_MACHINE_NAME;
            uri = uri.with({ scheme: newScheme });
        }
        return uri;
    }
}
