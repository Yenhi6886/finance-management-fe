import React from 'react'
import { Card, CardContent } from '../../../components/ui/card'
import { Construction } from 'lucide-react'

const Reports = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-green-600">Báo Cáo Tài Chính</h1>
                <p className="text-muted-foreground mt-1">
                    Tổng quan và phân tích chi tiết về tình hình tài chính của bạn.
                </p>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="flex flex-col items-center justify-center h-96 text-center">
                        <Construction className="w-16 h-16 text-muted-foreground/30 mb-4" />
                        <h3 className="text-2xl font-bold tracking-tight">Tính năng đang được phát triển</h3>
                        <p className="text-muted-foreground mt-2 max-w-sm">
                            Chúng tôi đang làm việc chăm chỉ để mang đến cho bạn các báo cáo trực quan và hữu ích nhất. Vui lòng quay lại sau!
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Reports