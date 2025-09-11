import React, { useState } from 'react'
import { Button } from '../../../components/ui/button'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
} from '../../../components/ui/alert-dialog'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { walletService } from '../services/walletService'
import { LottieLoader } from '../../../components/Loading'

const AddWalletModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        icon: '💰',
        name: '',
        amount: '',
        currency: 'VND',
        description: '',
    })
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [apiError, setApiError] = useState('')

    const validate = () => {
        const newErrors = {}
        if (!formData.name.trim()) newErrors.name = 'Tên ví không được để trống.'
        if (formData.name.length > 50) newErrors.name = 'Tên ví không quá 50 ký tự.'
        if (String(formData.amount).trim() === '') newErrors.amount = 'Số tiền không được để trống.'
        else if (isNaN(formData.amount) || parseFloat(formData.amount) < 0) {
            newErrors.amount = 'Vui lòng nhập một số hợp lệ.'
        }
        if (!formData.currency.trim()) newErrors.currency = 'Đơn vị tiền tệ không được để trống.'
        if (formData.currency.length !== 3) newErrors.currency = 'Đơn vị tiền tệ phải có 3 ký tự (VND, USD,...).'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setApiError('')
        if (!validate()) {
            return
        }
        setIsLoading(true)
        try {
            const dataToSend = {
                ...formData,
                amount: parseFloat(formData.amount),
            }
            await walletService.createWallet(dataToSend)
            onSuccess()
            handleClose()
        } catch (error) {
            if (error.response && error.response.data && error.response.data.data) {
                setErrors(error.response.data.data)
            } else {
                setApiError(error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setFormData({
            icon: '💰',
            name: '',
            amount: '',
            currency: 'VND',
            description: '',
        })
        setErrors({})
        setApiError('')
        setIsLoading(false)
        onClose()
    }

    if (!isOpen) return null

    return (
        <AlertDialog open={isOpen} onOpenChange={handleClose}>
            <AlertDialogContent className="relative">
                {isLoading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm">
                        <LottieLoader size="md" />
                    </div>
                )}
                <AlertDialogHeader>
                    <AlertDialogTitle>Thêm ví mới</AlertDialogTitle>
                    <AlertDialogDescription>
                        Nhập thông tin chi tiết cho ví mới của bạn.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <form onSubmit={handleSubmit} id="add-wallet-form">
                    <div className="space-y-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="icon" className="text-right">
                                Icon
                            </Label>
                            <Input
                                id="icon"
                                name="icon"
                                value={formData.icon}
                                onChange={handleChange}
                                className="col-span-3"
                                maxLength="2"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Tên ví
                            </Label>
                            <div className="col-span-3 flex flex-col">
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                                Số tiền
                            </Label>
                            <div className="col-span-3 flex flex-col">
                                <Input
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    step="any"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    className={errors.amount ? 'border-red-500' : ''}
                                />
                                {errors.amount && <p className="text-sm text-red-500 mt-1">{errors.amount}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="currency" className="text-right">
                                Tiền tệ
                            </Label>
                            <div className="col-span-3 flex flex-col">
                                <Input
                                    id="currency"
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleChange}
                                    className={errors.currency ? 'border-red-500' : ''}
                                />
                                {errors.currency && <p className="text-sm text-red-500 mt-1">{errors.currency}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Mô tả
                            </Label>
                            <Input
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="col-span-3"
                            />
                        </div>
                        {apiError && <p className="text-sm text-red-500 text-center">{apiError}</p>}
                    </div>
                </form>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleClose}>Hủy</AlertDialogCancel>
                    <Button type="submit" form="add-wallet-form" disabled={isLoading}>
                        Thêm ví
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
export default AddWalletModal
