// tag::copyright[]
/*******************************************************************************
 * Copyright (c) 2020 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     IBM Corporation - Initial implementation
 *******************************************************************************/
// end::copyright[]
package io.openliberty.guides.gateway.client;

import io.openliberty.guides.models.*;
import org.eclipse.microprofile.faulttolerance.Asynchronous;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.concurrent.CompletionStage;

@Path("/inventory")
@RegisterRestClient(configKey = "InventoryClient", baseUri = "http://localhost:9085")
public interface InventoryClient {

    @GET
    @Path("/systems")
    @Produces(MediaType.APPLICATION_JSON)
    Response getSystems();

    @GET
    @Path("/systems/{hostname}")
    @Produces(MediaType.APPLICATION_JSON)
    Response getSystem(@PathParam("hostname") String hostname);

    @POST
    @Path("/systems/property")
    @Consumes(MediaType.TEXT_PLAIN)
    @Produces(MediaType.APPLICATION_JSON)
    @Asynchronous
    CompletionStage<Response> addProperty(String propertyName);

    @DELETE
    @Path("/")
    Response resetSystems();
}