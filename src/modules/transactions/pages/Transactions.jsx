import React from 'react'
import { Card, CardContent } from '../../../components/ui/card'
import { Construction } from 'lucide-react'

const Transactions = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-green-600">Quản Lý Thu Chi</h1>
                <p className="text-muted-foreground mt-1">
                    Theo dõi, phân loại và quản lý tất cả các khoản thu chi của bạn tại một nơi.
                </p>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="flex flex-col items-center justify-center h-96 text-center">
                        <Construction className="w-16 h-16 text-muted-foreground/30 mb-4" />
                        <h3 className="text-2xl font-bold tracking-tight">Tính năng đang được phát triển</h3>
                        <p className="text-muted-foreground mt-2 max-w-sm">
                            Trang quản lý giao dịch chi tiết sắp ra mắt. Cảm ơn sự kiên nhẫn của bạn!
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Transactions