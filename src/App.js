import { useEffect, useReducer, useState } from "react";

const WEBHOOK_URL_REGEX = /^https:\/\/media\.guilded\.gg\/webhooks\/([\w-]+)\/([^/ ]+)$/;

const Link = ({ href, children }) => <a className="text-guilded-link hover:text-guilded-white transition" href={href}>{children}</a>

function App() {
  const origin = "https://guilded.shayy.workers.dev";
  const repo = "https://github.com/shayypy/guilded-webhook-proxy";
  const [webhookData, setWebhookData] = useState();
  const [webhookError, setWebhookError] = useState();
  const [url, setUrl] = useState(origin);
  const [query, updateQuery] = useReducer((d, partialD) => ({ ...d, ...partialD }), {});

  useEffect(() => {
    setUrl(origin + (webhookData ? `/${webhookData.id}/${webhookData.token}` : "") + (Object.keys(query).length === 0 ? "" : ("?" + new URLSearchParams(query).toString())));
  }, [query, webhookData]);

  return (
    <div className="bg-guilded-gray text-guilded-white flex h-screen overflow-auto">
      <div className="max-w-4xl p-8 mx-auto w-full">
        <h1 className="font-bold text-2xl">Guilded Webhook Proxy URL Generator</h1>
        Hello! This is a simple URL generator for my Guilded webhook proxy.
        Read more about the project <Link href={repo + "#readme"}>here</Link>{" "}
        and use the tool by pasting a Guilded webhook URL below (
        <Link href="https://support.guilded.gg/hc/en-us/articles/360038927934">
          create a webhook
        </Link>
        ) then selecting the special features to configure, if any.
        <div className="mt-4">
          <label>
            <p className="text-sm">Webhook URL</p>
            <input
              className="bg-guilded-slate w-full p-2 rounded text-guilded-subtitle focus:text-guilded-white transition"
              placeholder="https://media.guilded.gg/webhooks/..."
              onInput={(e) => {
                setWebhookError(undefined);
                if (!e.currentTarget.value) return;

                const match = e.currentTarget.value.match(WEBHOOK_URL_REGEX);
                if (match) {
                  setWebhookData({
                    id: match[1],
                    token: match[2],
                  });
                } else {
                  setWebhookData(undefined);
                  setWebhookError(<>Invalid webhook URL. Press "Copy URL" in the Guilded webhooks menu and then paste here. <Link href="https://support.guilded.gg/hc/en-us/articles/360038927934">Click here</Link> for instructions on creating a webhook.</>);
                }
              }}
            />
          </label>
          {webhookData ? (
            <div className="mt-2">
              <label>
                <p className="text-sm">New URL</p>
                <input
                  className="bg-guilded-slate w-full p-2 rounded flex"
                  value={url}
                  readOnly
                />
              </label>
            </div>
          ) : (
            <div>
              <p className="text-sm text-guilded-subtitle">
                {webhookError ? (
                  <span className="text-red-400">{webhookError}</span>
                ) : (
                  <span>Input a valid webhook URL above to get a replacement URL for GitHub.</span>
                )}
              </p>
            </div>
          )}
        </div>
        <div className={`mt-4 transition ${webhookData ? "" : "grayscale brightness-75 pointer-events-none select-none"}`}>
          <p className="font-bold text-xl">Goodies</p>
          <p>Read about these features <Link href={repo + "#goodies"}>in detail</Link></p>
          <ul className="space-y-0.5 mt-1">
            <li>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) => updateQuery({ reactions: String(e.currentTarget.checked) })}
                  defaultChecked
                />{" "}
                Reactions under applicable events
              </label>
            </li>
            <li>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) => updateQuery({ drafts: String(e.currentTarget.checked) })}
                  defaultChecked
                />{" "}
                Ignore draft release messages
              </label>
            </li>
            <li>
              <label>
                Immersive mode{" "}
                <select
                  className="px-2 py-1 align-middle bg-guilded-slate rounded"
                  onChange={(e) => {
                    const val = e.currentTarget.selectedOptions[0].value;
                    updateQuery({ immersive: val });
                  }}
                >
                  <option value="">Disabled</option>
                  <option value="chat">Chat</option>
                  <option value="embeds">Embeds</option>
                </select>
              </label>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
