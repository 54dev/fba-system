// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, message } from "antd";
import { fetchDashboard } from "../api";

const Dashboard = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchDashboard()
      .then((data) => setStats(data))
      .catch((e) => {
        console.error(e);
        message.error("加载统计信息失败");
      })
      .finally(() => setLoading(false));
  }, []);

  const role = user?.role;

  if (!stats) {
    return (
      <Card loading={loading}>
        <p>加载中...</p>
      </Card>
    );
  }

  const cards = [];

  if (role === "admin" || role === "reviewer") {
    cards.push(
      {
        key: "total_products",
        title: "产品总数",
        value: stats.total_products || 0,
      },
      {
        key: "approved_products",
        title: "已通过",
        value: stats.approved_products || 0,
      },
      {
        key: "rejected_products",
        title: "已拒绝",
        value: stats.rejected_products || 0,
      },
      {
        key: "pending_products",
        title: "待审核",
        value: stats.pending_products || 0,
      }
    );
  }

  if (role === "operator") {
    cards.push(
      {
        key: "my_total",
        title: "我提交的产品总数",
        value: stats.my_total_products || 0,
      },
      {
        key: "my_approved",
        title: "我提交的已通过",
        value: stats.my_approved_products || 0,
      },
      {
        key: "my_rejected",
        title: "我提交的已拒绝",
        value: stats.my_rejected_products || 0,
      },
      {
        key: "my_pending",
        title: "我提交的待审核",
        value: stats.my_pending_products || 0,
      }
    );
  }

  if (role === "admin") {
    cards.push(
      {
        key: "operators",
        title: "操作员数量",
        value: stats.operators || 0,
      },
      {
        key: "reviewers",
        title: "审核员数量",
        value: stats.reviewers || 0,
      }
    );
  }

  if (role === "reviewer") {
    cards.push({
      key: "operators",
      title: "操作员数量",
      value: stats.operators || 0,
    });
  }

  return (
    <div>
      <Row gutter={[16, 16]}>
        {cards.map((item) => (
          <Col key={item.key} xs={12} md={6}>
            <Card>
              <Statistic title={item.title} value={item.value} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Dashboard;
