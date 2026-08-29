import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, RefreshCcw } from "lucide-react";
import { healthCheckApi } from "../../services/healthCheckApi";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";

export default function Health() {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  const check = async () => {
    setStatus("loading");
    try {
      const { data } = await healthCheckApi.check();
      setMessage(data?.data?.message || "Server is running");
      setStatus("up");
    } catch {
      setMessage("Unable to reach the API server");
      setStatus("down");
    }
  };

  useEffect(() => {
    check();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          System Health
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Backend API connectivity status.
        </p>
      </div>

      <Card className="max-w-md flex items-center gap-4">
        {status === "loading" ? (
          <Loader label="Checking..." />
        ) : (
          <>
            <div
              className={`p-3 rounded-xl ${
                status === "up"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-500"
              }`}
            >
              {status === "up" ? (
                <CheckCircle2 size={20} />
              ) : (
                <XCircle size={20} />
              )}
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-800">
                {status === "up"
                  ? "All systems operational"
                  : "Server unreachable"}
              </p>
              <p className="text-xs text-slate-400">{message}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCcw}
              onClick={check}
            >
              Recheck
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
