import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export default function Dashboard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        axiosClient.get("/dashboard")
            .then((res) => setData(res.data))
            .catch((err) => console.error(err));
    }, []);

    if (!data) return <p>加载中...</p>;

    return (
        <div>
            <h2>后台首页</h2>

            <ul>
                <li>提交产品总数：{data.total_products}</li>
                <li>审核通过：{data.approved_products}</li>
                <li>审核中：{data.pending_products}</li>
                <li>审核拒绝：{data.rejected_products}</li>
                <li>操作员人数：{data.operator_count}</li>
                <li>审核员人数：{data.reviewer_count}</li>
            </ul>

            <h3>最近登录</h3>
            <ul>
                {data.recent_logins.map((log) => (
                    <li key={log.id}>
                        {log.user?.name} —— {log.logged_in_at}
                    </li>
                ))}
            </ul>
        </div>
    );
}
