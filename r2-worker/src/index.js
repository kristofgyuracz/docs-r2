/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		const key = url.pathname.slice(1);

		if (request.method === "GET") {
			console.log("url:", url);
			console.log("key:", key);

			var requestPath;
			if (key[key.length - 1] == "/") {
				requestPath = key + "index.html";
			} else {
				requestPath = key;
			}

			var object = await env.MY_BUCKET.get(requestPath);
			var headers = new Headers();


			if (object !== null) {
				object.writeHttpMetadata(headers);
				headers.set("etag", object.httpEtag);
				headers.set("content-type", object.httpContentType);
				return new Response(object.body, {
					headers,
				});
			}

			requestPath = requestPath + "/index.html";
			object = await env.MY_BUCKET.get(requestPath);
			if (object !== null) {
				object.writeHttpMetadata(headers);
				headers.set("etag", object.httpEtag);
				headers.set("content-type", object.httpContentType);
				return new Response(object.body, {
					headers,
				});
			}

			return new Response("Object Not Found", { status: 404 });
		}
		else {
			return new Response("Method Not Allowed", {
				status: 405,
				headers: {
					Allow: "GET",
				},
			});
		}
	},
};
