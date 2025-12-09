// src/pages/Dashboard.jsx

import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Spin, message } from "antd";
import { fetchDashboardStats } from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then((data) => setStats(data))
      .catch((err) => {
        console.error(err);
        message.error("加载统计信息失败");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Spin tip="加载中..." />;
  }

  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card>
          <Statistic
            title="产品总数"
            value={stats?.total_products || 0}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="已通过"
            value={stats?.approved_products || 0}
            valueStyle={{ color: "#3f8600" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="已拒绝"
            value={stats?.rejected_products || 0}
            valueStyle={{ color: "#cf1322" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="待审核"
            value={stats?.pending_products || 0}
          />
        </Card>
      </Col>

      <Col span={6} style={{ marginTop: 16 }}>
        <Card>
          <Statistic
            title="操作员数量"
            value={stats?.operators || 0}
          />
        </Card>
      </Col>
      <Col span={6} style={{ marginTop: 16 }}>
        <Card>
          <Statistic
            title="审核员数量"
            value={stats?.reviewers || 0}
          />
        </Card>
      </Col>
    </Row>
  );
}
