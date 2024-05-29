import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi";

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const {
    data,
    status: balanceStatus,
    error: balanceError,
  } = useBalance({ chainId: 31337, address: account.address });
  const { disconnect } = useDisconnect();

  return (
    <>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === "connected" && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>

      <div>
        <h2>Balance</h2>
        <div>
          {data != undefined ? (
            data.value.toString(10)
          ) : (
            <span>Loading...</span>
          )}{" "}
          ETH
        </div>
        <div>{balanceStatus}</div>
        <div>{balanceError?.message}</div>
      </div>
    </>
  );
}

export default App;
