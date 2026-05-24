import React, { useState, useEffect } from 'react';
import { Button, Form, Input, notification } from 'antd';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import AuthPageShell from '../components/auth/AuthPageShell';
import { verifyOtpApi } from '../util/api';

const VerifyOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    
    // Nhận email từ trang đăng ký truyền sang
    const email = location.state?.email;

    useEffect(() => {
        // Nếu không có email (truy cập trực tiếp URL), đẩy về trang đăng ký
        if (!email) {
            notification.warning({
                message: "Thông báo",
                description: "Không tìm thấy thông tin email xác thực. Vui lòng đăng ký lại."
            });
            navigate("/register");
        }
    }, [email, navigate]);

    const onFinish = async (values) => {
        const { otp } = values;
        setLoading(true);

        try {
            // LƯU Ý: Nếu file api.js của bạn định nghĩa nhận vào 1 object dữ liệu:
            const res = await verifyOtpApi({ email, otp }); 
            
            // HOẶC nếu file api.js định nghĩa dạng 2 tham số rời rạc verifyOtpApi(email, otp), hãy đổi thành câu lệnh bên dưới:
            // const res = await verifyOtpApi(email, otp); 

            if (res?.status === 200) {
                notification.success({
                    message: "XÁC THỰC TÀI KHOẢN",
                    description: "Tài khoản của bạn đã được kích hoạt thành công! Vui lòng đăng nhập."
                });
                
                // Chuyển hướng về login và điền sẵn email vừa kích hoạt
                navigate("/login", { state: { email: email } });
            } else {
                notification.error({
                    message: "XÁC THỰC TÀI KHOẢN",
                    description: res?.message || "Mã OTP không chính xác."
                });
            }
        } catch (error) {
            notification.error({
                message: "XÁC THỰC TÀI KHOẢN",
                description: error.response?.data?.message || "Mã OTP không hợp lệ hoặc đã hết hạn."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthPageShell
            eyebrow="Verification"
            title="Xác thực tài khoản"
            description={
                <span>
                    Mã xác thực OTP gồm 6 chữ số đã được gửi đến hòm thư: <br />
                    <b className="text-black">{email}</b>
                </span>
            }
            footer={
                <div className="auth-page__footer">
                    <Link to="/"><ArrowLeftOutlined /> Quay lại trang chủ</Link>
                    <span>
                        Chưa nhận được mã? <Link to="/register">Đăng ký lại</Link>
                    </span>
                </div>
            }
        >
            <Form
                name="verify-otp-form"
                onFinish={onFinish}
                autoComplete="off"
                layout='vertical'
                requiredMark={false}
            >
                <Form.Item
                    label="Mã OTP"
                    name="otp"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mã OTP',
                        },
                        {
                            len: 6,
                            message: 'Mã OTP phải có đúng 6 ký tự số',
                        }
                    ]}
                >
                    <Input 
                        size="large" 
                        placeholder="••••••" 
                        maxLength={6}
                        style={{ 
                            textAlign: 'center', 
                            letterSpacing: '8px', 
                            fontSize: '20px',
                            fontWeight: 'bold' 
                        }}
                        onChange={(e) => {
                            // Chỉ cho phép nhập số vào ô input
                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                        }}
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block size="large">
                        Xác nhận kích hoạt
                    </Button>
                </Form.Item>
            </Form>
        </AuthPageShell>
    );
};

export default VerifyOTP;