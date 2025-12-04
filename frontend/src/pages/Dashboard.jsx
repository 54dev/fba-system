import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, message } from "antd";
import { fetchDashboardStats } from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboardStats()
      .then((res) => setStats(res))
      .catch(() => message.error("加载统计数据失败"));
  }, []);

  if (!stats) return <p>加载中...</p>;

  return (
    <div>
      <h2>主页统计</h2>

      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="总产品数" value={stats.total_products} />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic title="待审核" value={stats.pending_products} />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic title="已通过" value={stats.approved_products} />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic title="已拒绝" value={stats.rejected_products} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={6}>
          <Card>
            <Statistic title="操作员数量" value={stats.operators} />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic title="审核员数量" value={stats.reviewers} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
