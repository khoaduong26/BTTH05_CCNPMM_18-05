import React, { useContext, useState } from 'react';
import { Button, Form, Input, notification } from 'antd';
import { loginApi } from '../util/api';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/context/auth.context';
import { ArrowLeftOutlined } from '@ant-design/icons';
import AuthPageShell from '../components/auth/AuthPageShell';

const LoginPage = () => {
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        const { email, password } = values;
        setLoading(true);

        try {
            const res = await loginApi({ email, password });

            if (res?.token && res?.user && res?.status === 200) {
                notification.success({
                    message: "LOGIN USER",
                    description: "Success"
                });
                setAuth({
                    isAuthenticated: true,
                    token: res.token,
                    user: {
                        id: res?.user?.id ?? "",
                        email: res?.user?.email ?? "",
                        role: res?.user?.role ?? "USER",
                        name: res?.user?.name ?? ""
                    }
                })
                const nextUrl = res?.user?.role === 'ADMIN' ? '/admin/profile' : '/';
                navigate(res?.url || nextUrl, { replace: true });

            } else {
                notification.error({
                    message: "LOGIN USER",
                    description: res?.message ?? "error"
                })
            }
        } catch {
            notification.error({
                message: "LOGIN USER",
                description: "Không thể kết nối đến máy chủ"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthPageShell
            eyebrow="Secure auth"
            title="Đăng nhập"
            description="Truy cập an toàn bằng JWT, có hỗ trợ role-based redirect cho user và admin."
            footer={
                <div className="auth-page__footer">
                    <Link to="/"><ArrowLeftOutlined /> Quay lại trang chủ</Link>
                    <span>
                        Chưa có tài khoản? <Link to="/register">Đăng ký tại đây</Link>
                    </span>
                </div>
            }
        >
            <Form
                name="login-form"
                onFinish={onFinish}
                autoComplete="off"
                layout='vertical'
                requiredMark={false}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập email',
                        },
                        {
                            type: 'email',
                            message: 'Email không hợp lệ'
                        }
                    ]}
                >
                    <Input size="large" placeholder="name@example.com" />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu',
                        },
                    ]}
                >
                    <Input.Password size="large" placeholder="••••••••" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block size="large">
                        Đăng nhập
                    </Button>
                </Form.Item>
            </Form>
        </AuthPageShell>
    )
}

export default LoginPage;