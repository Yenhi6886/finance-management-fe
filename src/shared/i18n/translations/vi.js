// Vietnamese translations
export const vi = {
  // Common
  common: {
    loading: 'Đang tải...',
    save: 'Lưu',
    cancel: 'Hủy',
    delete: 'Xóa',
    edit: 'Sửa',
    add: 'Thêm',
    close: 'Đóng',
    confirm: 'Xác nhận',
    yes: 'Có',
    no: 'Không',
    search: 'Tìm kiếm',
    filter: 'Lọc',
    back: 'Quay lại',
    next: 'Tiếp theo',
    previous: 'Trước',
    viewAll: 'Xem tất cả',
    refresh: 'Làm mới',
    export: 'Xuất',
    import: 'Nhập',
    settings: 'Cài đặt',
    logout: 'Đăng xuất',
    login: 'Đăng nhập',
    register: 'Đăng ký',
    info: 'Thông tin',
    warning: 'Cảnh báo',
    error: 'Lỗi',
    success: 'Thành công',
    darkMode: 'Chế độ tối',
    lightMode: 'Chế độ sáng',
    confirmLogout: 'Xác nhận đăng xuất',
    logoutConfirmation: 'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này không?',
    appName: 'Xspend',
    loadError: 'Không thể tải dữ liệu',
  },

  // Navigation
  navigation: {
    dashboard: 'Dashboard',
    transactions: 'Thu Chi',
    wallets: 'Ví Tiền', 
    reports: 'Báo Cáo',
    currency: 'Tỷ Giá',
    profile: 'Hồ Sơ',
    settings: 'Cài Đặt',
    addWallet: 'Thêm Ví',
    changePassword: 'Đổi mật khẩu',
  },

  // Authentication
  auth: {
    login: {
      title: 'Chào mừng đến với XSPEND',
      subtitle: 'Đăng nhập vào tài khoản của bạn',
      emailOrUsername: 'Email hoặc tên đăng nhập',
      emailOrUsernamePlaceholder: 'Nhập email hoặc tên đăng nhập',
      password: 'Mật khẩu',
      passwordPlaceholder: 'Nhập mật khẩu',
      forgotPassword: 'Quên mật khẩu?',
      loginWithGoogle: 'Đăng nhập với Google',
      orLoginWith: 'hoặc đăng nhập bằng email',
      termsAgreement: 'Bằng cách đăng nhập, bạn đồng ý với {terms} và {privacy}',
      termsOfService: 'Điều khoản dịch vụ',
      privacyPolicy: 'Chính sách bảo mật',
      processing: 'Đang xử lý...',
      loginButton: 'Đăng nhập',
      noAccount: 'Chưa có tài khoản?',
      signUpNow: 'Đăng ký ngay',
      termsRequired: 'Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật để tiếp tục.',
    },

    register: {
      title: 'Tạo tài khoản mới',
      googleSignUp: 'Đăng ký với Google',
      orSignUpWithEmail: 'hoặc đăng ký bằng email',
      firstName: 'Tên',
      lastName: 'Họ',
      username: 'Tên đăng nhập',
      email: 'Email',
      password: 'Mật khẩu',
      confirmPassword: 'Xác nhận mật khẩu',
      enterPassword: 'Nhập mật khẩu',
      confirmPasswordPlaceholder: 'Xác nhận lại mật khẩu',
      termsText: {
        prefix: 'Bằng cách đăng ký, tôi đồng ý với',
        terms: 'Điều khoản dịch vụ',
        and: 'và',
        privacy: 'Chính sách bảo mật'
      },
      processing: 'Đang xử lý...',
      createAccount: 'Tạo tài khoản',
      haveAccount: 'Đã có tài khoản?',
      loginLink: 'Đăng nhập',
      success: 'Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản của bạn.',
      error: 'Đăng ký thất bại. Vui lòng thử lại.',
      validation: {
        emailRequired: 'Email là bắt buộc',
        emailInvalid: 'Email không hợp lệ',
        confirmPasswordRequired: 'Xác nhận mật khẩu là bắt buộc',
        passwordMismatch: 'Mật khẩu xác nhận không khớp',
        termsRequired: 'Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật để tiếp tục.'
      }
    },

    forgotPassword: {
      title: 'Quên mật khẩu',
      description: 'Nhập email để nhận link đặt lại mật khẩu.',
      emailLabel: 'Email',
      emailPlaceholder: 'Nhập địa chỉ email đã đăng ký',
      sending: 'Đang gửi...',
      sendResetLink: 'Gửi link reset',
      rememberPassword: 'Nhớ ra mật khẩu?',
      loginNow: 'Đăng nhập ngay',
      success: {
        title: 'Kiểm tra email của bạn',
        description: 'Nếu email của bạn tồn tại trong hệ thống, một liên kết để đặt lại mật khẩu đã được gửi đến.',
        instruction: 'Vui lòng kiểm tra hộp thư (bao gồm cả thư mục spam) và làm theo hướng dẫn để hoàn tất việc đặt lại mật khẩu.',
        resendLink: 'Gửi lại link',
        resendCountdown: 'Gửi lại sau {seconds}s',
        backToLogin: 'Quay lại đăng nhập'
      },
      validation: {
        emailInvalid: 'Email không hợp lệ'
      }
    },

    resetPassword: {
      title: 'Đặt lại mật khẩu',
      subtitle: 'Nhập mật khẩu mới cho tài khoản của bạn',
      password: 'Mật khẩu mới',
      passwordPlaceholder: 'Nhập mật khẩu mới',
      confirmPassword: 'Xác nhận mật khẩu mới',
      confirmPasswordPlaceholder: 'Nhập lại mật khẩu mới',
      processing: 'Đang xử lý...',
      resetPassword: 'Đặt lại mật khẩu',
      invalidRequest: 'Yêu cầu không hợp lệ',
      requestNewLink: 'Yêu cầu link mới',
      validationErrors: {
        passwordRequired: 'Mật khẩu là bắt buộc',
        passwordMismatch: 'Mật khẩu xác nhận không khớp',
      },
      success: 'Mật khẩu đã được thay đổi thành công.',
    },

    activateAccount: {
      title: 'Kích hoạt tài khoản',
      invalidLink: 'Đường dẫn kích hoạt không hợp lệ hoặc thiếu token.',
      successMessage: 'Tài khoản đã được kích hoạt thành công! Vui lòng đăng nhập.',
      errorMessage: 'Kích hoạt tài khoản thất bại. Token có thể đã hết hạn hoặc không hợp lệ.',
      activating: 'Đang kích hoạt tài khoản của bạn...',
      pleaseWait: 'Vui lòng đợi trong giây lát.',
      successTitle: 'Kích hoạt thành công!',
      successDescription: 'Tài khoản của bạn đã sẵn sàng. Sẽ tự động chuyển đến trang đăng nhập sau 3 giây.',
      errorTitle: 'Kích hoạt thất bại',
      backToLogin: 'Quay lại trang đăng nhập'
    },

    messages: {
      loginFailed: 'Đăng nhập thất bại',
      registerFailed: 'Đăng ký thất bại',
      forgotPasswordError: 'Không thể gửi email đặt lại mật khẩu',
      resetPasswordError: 'Không thể đặt lại mật khẩu',
      logoutSuccess: 'Đăng xuất thành công!',
      updateProfileSuccess: 'Cập nhật thông tin thành công!',
      updateProfileError: 'Cập nhật thông tin thất bại',
      deleteAccountSuccess: 'Tài khoản đã được xoá thành công!',
      deleteAccountError: 'Xoá tài khoản thất bại',
      avatarUpdateSuccess: 'Ảnh đại diện đã được cập nhật!',
      avatarUpdateError: 'Cập nhật ảnh đại diện thất bại',
      forgotPasswordSuccess: 'Link đặt lại mật khẩu đã được gửi đến email của bạn.',
    },
  },

  // Wallets
  wallets: {
    title: 'Ví Tiền & Chức Năng',
    subtitle: 'Quản lý ví và thực hiện các giao dịch một cách nhanh chóng.',
    loading: 'Đang tải dữ liệu...',
    
    add: {
      title: 'Thêm Ví Mới',
      subtitle: 'Tạo một ví mới để quản lý tài chính của bạn',
      backButton: 'Quay lại',
      walletInformation: 'Thông Tin Ví',
      nameLabel: 'Tên ví',
      namePlaceholder: 'Ví tiền mặt, Tài khoản ngân hàng...',
      iconLabel: 'Icon ví',
      currency: 'Loại tiền tệ',
      currencyVND: 'Việt Nam Đồng (₫)',
      description: 'Mô tả (tùy chọn)',
      descriptionPlaceholder: 'Mô tả về ví này...',
      creating: 'Đang tạo ví...',
      createButton: 'Tạo Ví Mới',
      preview: 'Xem trước',
      previewName: 'Tên ví',
      balance: 'Số dư',
      tips: 'Mẹo Hữu Ích',
      tip1: 'Chọn icon phù hợp giúp bạn dễ dàng nhận biết ví khi giao dịch.',
      tip2: 'Bạn có thể tạo nhiều ví cho các mục đích khác nhau như chi tiêu, tiết kiệm.',
      validation: {
        nameRequired: 'Tên ví là bắt buộc.',
        nameMaxLength: 'Tên ví không được quá 50 ký tự.',
        descriptionMaxLength: 'Mô tả không được quá 200 ký tự.',
      },
      checkFormMessage: 'Vui lòng kiểm tra lại các thông tin đã nhập.',
      successMessage: 'Ví "{walletName}" đã được tạo thành công!',
      createError: 'Có lỗi xảy ra khi tạo ví. Vui lòng thử lại.',
    },

    edit: {
      title: 'Chỉnh Sửa Ví',
      subtitle: 'Cập nhật thông tin cho ví của bạn',
      backButton: 'Quay lại',
      loading: 'Đang tải dữ liệu ví...',
      walletNotFound: 'Không tìm thấy ví bạn yêu cầu.',
      loadError: 'Có lỗi xảy ra khi tải thông tin ví.',
      validationError: 'Vui lòng kiểm tra lại các thông tin đã nhập.',
      updateSuccess: 'Ví "{name}" đã được cập nhật thành công!',
      updateError: 'Có lỗi xảy ra khi cập nhật ví.',
      formTitle: 'Chỉnh Sửa Thông Tin',
      nameLabel: 'Tên ví',
      namePlaceholder: 'Ví tiền mặt, Tài khoản ngân hàng...',
      currentBalance: 'Số dư hiện tại',
      currencyLabel: 'Loại tiền tệ',
      iconLabel: 'Icon ví',
      descriptionLabel: 'Mô tả (Tùy chọn)',
      descriptionPlaceholder: 'Mô tả về mục đích của ví này...',
      saveButton: 'Lưu Thay Đổi',
      savingButton: 'Đang lưu...',
      previewTitle: 'Xem trước',
      previewBalance: 'Số dư',
      previewName: 'Tên ví',
      tipsTitle: 'Mẹo Hữu Ích',
      tipsDescription: 'Mô tả rõ ràng giúp bạn nhớ lại mục đích của ví sau này.',
      noTransactionsTitle: 'Ví chưa có giao dịch',
      noTransactionsDescription: 'Ví này chưa có giao dịch nào. Bạn có thể nạp tiền vào ví để bắt đầu sử dụng.',
      currency: {
        vnd: 'Việt Nam Đồng (₫)'
      },
      validation: {
        nameRequired: 'Tên ví là bắt buộc.',
        nameLength: 'Tên ví không được quá 50 ký tự.',
        descriptionLength: 'Mô tả không được quá 200 ký tự.'
      }
    },

    list: {
      title: 'Ví Tiền & Chức Năng',
      subtitle: 'Quản lý ví và thực hiện các giao dịch một cách nhanh chóng.',
      loading: 'Đang tải dữ liệu...',
      loadError: 'Không thể tải danh sách ví.',
      controlPanel: 'Bảng Điều Khiển Ví',
      walletListTitle: 'Danh Sách Ví Của Bạn',
      activeWalletsTab: 'Ví Hoạt Động ({count})',
      archivedWalletsTab: 'Ví Lưu Trữ ({count})',
      overview: 'Tổng Quan Số Dư',
      overviewDesc: 'Tổng số dư các ví đang hoạt động',
      exchangeRate: 'Tham khảo tỷ giá',
      totalWallets: 'Tổng Số Ví',
      activeWallets: 'Ví đang hoạt động:',
      archivedWallets: 'Ví đang lưu trữ:',
      balance: 'Số dư',
      tips: 'Mẹo Hữu Ích',
      tip1: 'Đặt tên và icon riêng cho từng ví để dễ dàng phân biệt.',
      tip2: 'Sử dụng ví lưu trữ cho các tài khoản ít dùng đến để giao diện gọn gàng.',
      
      // Actions
      actions: {
        viewList: 'Xem Danh Sách Ví',
        viewListDesc: 'Di chuyển đến danh sách ví của bạn',
        addWallet: 'Thêm Ví Mới',
        addWalletDesc: 'Tạo một tài khoản ví mới để theo dõi',
        transferMoney: 'Chuyển Tiền',
        transferMoneyDesc: 'Di chuyển số dư giữa các ví của bạn',
        addMoney: 'Nạp Tiền Vào Ví',
        addMoneyDesc: 'Ghi nhận một khoản thu nhập hoặc nạp tiền',
        shareWallet: 'Chia Sẻ Ví',
        shareWalletDesc: 'Mời người khác cùng quản lý chi tiêu',
        
        // Dropdown actions
        viewDetails: 'Xem chi tiết',
        editWallet: 'Chỉnh sửa ví',
        setDefault: 'Đặt mặc định',
        archive: 'Lưu trữ',
        restore: 'Khôi phục',
        delete: 'Xóa ví',
      },

      // Empty states
      noActiveWallets: 'Chưa có ví nào đang hoạt động',
      noArchivedWallets: 'Không có ví nào trong kho lưu trữ',
      noActiveWalletsDesc: 'Tạo một ví mới hoặc khôi phục ví từ kho lưu trữ để chúng hiển thị tại đây.',
      noArchivedWalletsDesc: 'Bạn có thể khôi phục các ví đã lưu trữ để tiếp tục sử dụng.',

      // Permissions
      permissions: {
        view: 'Chỉ xem',
        edit: 'Chỉnh sửa', 
        owner: 'Toàn quyền',
      },

      // Messages
      sharedBy: 'Được chia sẻ bởi {owner}',
      archiveRestoreInfo: 'Bạn cần khôi phục ví trước khi xóa.',
      deleteSuccess: 'Ví "{walletName}" đã được xóa thành công.',
      deleteError: 'Đã xảy ra lỗi khi xóa ví.',
      archiveSuccess: 'Ví "{walletName}" đã được {action} thành công.',
      archiveError: 'Lỗi khi {action} ví.',
      setDefaultSuccess: 'Ví "{walletName}" đã được đặt làm ví mặc định.',
      setDefaultError: 'Có lỗi xảy ra khi đặt ví mặc định.',
      archiveActions: {
        archived: 'lưu trữ',
        restored: 'khôi phục',
      },

      // Delete confirmation
      deleteConfirm: {
        title: 'Bạn có chắc chắn muốn xóa ví?',
        description: 'Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh viễn ví "{walletName}" và tất cả dữ liệu giao dịch liên quan.',
        confirm: 'Xóa',
        cancel: 'Hủy',
      },
    },

    detail: {
      notFound: 'Không tìm thấy ví.',
      currentBalance: 'Số Dư Hiện Tại',
      noDescription: 'Không có mô tả',
      monthlyIncome: 'Thu Nhập Tháng',
      monthlyExpense: 'Chi Tiêu Tháng',
      netChange: 'Thay Đổi Ròng',
      balanceTrend: 'Xu Hướng Số Dư',
      expenseByCategory: 'Chi Tiêu Theo Danh Mục',
      transactionHistory: 'Lịch Sử Giao Dịch',
      addMoney: 'Nạp tiền',
      editWallet: 'Chỉnh sửa',
      shareWallet: 'Chia sẻ',
      archiveWallet: 'Lưu trữ',
      restoreWallet: 'Khôi phục',
      deleteWallet: 'Xóa',
      filterButton: 'Lọc',
      exportButton: 'Xuất file',
      noTransactions: 'Chưa có giao dịch nào trong ví này',
      noChartData: 'Chưa có đủ dữ liệu để vẽ biểu đồ.',
      noCategoryData: 'Chưa có dữ liệu chi tiêu theo danh mục.',
      uncategorized: 'Chưa phân loại',
      pagination: {
        previous: 'Trước',
        next: 'Sau',
        pageOf: 'Trang {current} / {total}',
      },
      deleteConfirm: {
        title: 'Xác nhận xóa ví',
        description: 'Bạn có chắc chắn muốn xóa ví này không? Hành động này không thể hoàn tác.',
        confirmButton: 'Xóa ví',
      },
      archiveSuccess: 'Ví "{walletName}" đã được {action} thành công.',
      archiveActions: {
        archived: 'lưu trữ',
        restored: 'khôi phục',
      },
      archiveError: 'Lỗi khi {action} ví.',
    },

    addMoney: {
      title: 'Nạp Tiền',
      subtitle: 'Thêm tiền vào ví của bạn',
      formTitle: 'Thông Tin Nạp Tiền',
      selectWallet: 'Chọn ví',
      selectWalletPlaceholder: 'Chọn ví để nạp tiền',
      amount: 'Số tiền',
      amountPlaceholder: 'Nhập số tiền',
      quickAmounts: 'Số tiền nhanh',
      note: 'Ghi chú',
      notePlaceholder: 'Ghi chú về giao dịch này...',
      addingMoney: 'Đang xử lý...',
      addMoneyButton: 'Nạp Tiền',
      noWalletsAvailable: 'Không có ví nào',
      recentTransactions: 'Giao Dịch Gần Đây',
      clickToAddSimilar: 'Click để nạp tiền tương tự',
      addToWallet: 'Nạp tiền vào ví {walletName}',
      noTransactions: 'Chưa có giao dịch nào',
      tips: 'Mẹo Hữu Ích',
      tip1: 'Sử dụng ghi chú để theo dõi nguồn gốc của tiền.',
      tip2: 'Kiểm tra kỹ thông tin ví và số tiền trước khi xác nhận.',
      tip3: 'Thường xuyên kiểm tra lịch sử giao dịch để quản lý tài chính tốt hơn.',
      noteHelp: 'Nhập tối đa 500 ký tự, có thể xuống dòng',
      noteSupport: 'Hỗ trợ emoji và ký tự đặc biệt',
      wordCount: 'từ',
      method: 'Nạp tiền',
      loadDataError: 'Không thể tải dữ liệu cần thiết.',
      addError: 'Có lỗi xảy ra khi nạp tiền',
      validationErrors: {
        walletRequired: 'Vui lòng chọn ví',
        amountRequired: 'Vui lòng nhập số tiền',
        amountMinimum: 'Số tiền tối thiểu là 1,000 ₫',
        amountMaximum: 'Số tiền nạp mỗi lần tối đa là 1,000,000,000 ₫ (1 tỉ)',
        balanceExceeded: 'Số dư ví sau khi nạp sẽ là {newBalance}, vượt quá giới hạn {maxBalance} (999 tỉ)',
        noteMaxLength: 'Ghi chú không được quá 500 ký tự',
      },
      confirmDialog: {
        title: 'Xác nhận Nạp Tiền',
        description: 'Vui lòng kiểm tra lại thông tin nạp tiền trước khi xác nhận.',
        wallet: 'Nạp vào ví:',
        amount: 'Số tiền:',
        note: 'Ghi chú:',
        confirm: 'Xác nhận',
        cancel: 'Hủy',
      },
      successDialog: {
        title: 'Nạp Tiền Thành Công!',
        description: 'Đã nạp thành công {amount} vào ví {walletName}.',
        newBalance: 'Số dư mới:',
        close: 'Đóng',
        viewWallet: 'Xem ví',
      },
    },

    transferMoney: {
      title: 'Chuyển tiền',
      subtitle: 'Chuyển tiền giữa các ví',
      fromWallet: 'Từ ví',
      fromWalletPlaceholder: 'Chọn ví nguồn',
      toWallet: 'Đến ví', 
      toWalletPlaceholder: 'Chọn ví đích',
      amount: 'Số tiền',
      amountPlaceholder: 'Nhập số tiền',
      description: 'Mô tả',
      descriptionPlaceholder: 'Mô tả cho giao dịch này (tùy chọn)',
      transferring: 'Đang chuyển...',
      transferButton: 'Chuyển Tiền',
      recentTransfers: 'Giao Dịch Chuyển Tiền Gần Đây',
      noTransactions: 'Chưa có giao dịch nào',
      confirmDialog: {
        title: 'Xác nhận chuyển tiền',
        description: 'Vui lòng kiểm tra lại thông tin chuyển tiền trước khi xác nhận.',
        fromWallet: 'Từ ví:',
        toWallet: 'Đến ví:',
        amount: 'Số tiền:',
      },
      validationErrors: {
        fromWalletRequired: 'Vui lòng chọn ví nguồn',
        toWalletRequired: 'Vui lòng chọn ví đích',
        sameWallet: 'Ví nguồn và ví đích không thể giống nhau',
        amountRequired: 'Vui lòng nhập số tiền',
        amountMinimum: 'Số tiền phải lớn hơn 0',
        insufficientBalance: 'Số dư không đủ để thực hiện giao dịch',
        descriptionMaxLength: 'Mô tả không được quá 200 ký tự',
      },
    },

    share: {
      title: 'Chia Sẻ Ví',
      subtitle: 'Gửi lời mời và quản lý quyền truy cập các ví của bạn.',
      sending: 'Đang gửi lời mời...',
      
      tabs: {
        sendInvitation: 'Gửi Lời Mời',
        sharedByMe: 'Ví Đã Chia Sẻ ({count})',
        sharedWithMe: 'Ví Được Chia Sẻ ({count})',
      },
      
      form: {
        title: 'Gửi lời mời chia sẻ ví',
        selectWallet: 'Chọn ví',
        selectWalletPlaceholder: 'Chọn một ví để chia sẻ',
        accessType: 'Loại quyền truy cập',
        recipientEmail: 'Email người nhận',
        emailPlaceholder: 'example@email.com',
        message: 'Lời nhắn (tùy chọn)',
        messagePlaceholder: 'Gửi lời nhắn cho người nhận...',
        charactersCount: '{current}/{max} ký tự',
        sendInvitation: 'Gửi Lời Mời',
      },
      
      permissions: {
        view: 'Chỉ xem',
        edit: 'Chỉnh sửa',
        owner: 'Chủ sở hữu',
        viewTitle: 'Người Xem',
        viewDescription: 'Chỉ xem thông tin, không thể chỉnh sửa.',
        viewExplanation: 'Xem số dư, lịch sử giao dịch. Không thể thay đổi.',
        editTitle: 'Chỉnh Sửa',
        editDescription: 'Thêm, sửa, xóa giao dịch.',
        editExplanation: 'Toàn quyền xem, thêm/sửa/xóa giao dịch.',
        ownerTitle: 'Chủ Sở Hữu',
        ownerDescription: 'Toàn quyền như bạn.',
        ownerExplanation: 'Mọi quyền của bạn, bao gồm cả chia sẻ và xóa ví.',
        explanation: 'Giải Thích Quyền',
      },
      
      status: {
        pending: 'Đang chờ',
        accepted: 'Đã chấp nhận',
        rejected: 'Đã từ chối',
        revoked: 'Đã thu hồi',
        expired: 'Đã hết hạn',
      },
      
      actions: {
        revoke: 'Thu hồi',
      },
      
      selectPermission: 'Chọn quyền',
      sharedTo: 'Chia sẻ tới',
      sentDate: 'Ngày gửi',
      sharedWith: 'Chia sẻ với',
      from: 'Từ',
      
      empty: {
        sharedByMe: 'Bạn chưa chia sẻ ví nào cho người khác.',
        sharedWithMe: 'Không có ví nào được chia sẻ với bạn.',
      },
      
      tips: {
        title: 'Mẹo Chia Sẻ An Toàn',
        tip1: 'Chỉ chia sẻ với người bạn hoàn toàn tin tưởng.',
        tip2: 'Bắt đầu với quyền "Người Xem" và nâng cấp sau nếu cần.',
        tip3: 'Thường xuyên kiểm tra danh sách "Ví Đã Chia Sẻ".',
      },
      
      confirmRevoke: {
        title: 'Xác nhận thu hồi chia sẻ',
        question: 'Bạn có chắc chắn muốn thu hồi chia sẻ này không?',
        warning: 'Người dùng sẽ mất quyền truy cập vào ví này ngay lập tức và không thể khôi phục.',
        confirm: 'Xác nhận thu hồi',
      },
      
      validation: {
        emailRequired: 'Vui lòng nhập email người nhận.',
      },
      
      success: {
        invitationSent: 'Lời mời chia sẻ ví đã được gửi thành công!',
        revokeShare: 'Thu hồi/xóa chia sẻ thành công.',
        updatePermission: 'Cập nhật quyền thành công.',
      },
      
      errors: {
        loadMyWallets: 'Không thể tải danh sách ví của bạn.',
        loadSharedByMe: 'Không thể tải danh sách ví đã chia sẻ.',
        loadSharedWithMe: 'Không thể tải danh sách ví được chia sẻ.',
        sendInvitation: 'Đã có lỗi xảy ra khi gửi lời mời.',
        actionFailed: 'Không thể thực hiện hành động này.',
        updatePermission: 'Không thể cập nhật quyền.',
      },
    },

    transfer: {
      title: 'Chuyển tiền',
      subtitle: 'Chuyển tiền nhanh chóng và an toàn giữa các ví của bạn',
      recentTransfers: 'Chuyển Tiền Gần Đây',
      noTransactions: 'Chưa có giao dịch nào',
      
      form: {
        title: 'Thông Tin Chuyển Tiền',
        fromWallet: 'Từ ví',
        toWallet: 'Đến ví',
        selectFromWallet: 'Chọn ví nguồn',
        selectToWallet: 'Chọn ví đích',
        amount: 'Số tiền chuyển',
        amountPlaceholder: 'Nhập số tiền',
        note: 'Ghi chú (tùy chọn)',
        notePlaceholder: 'Nhập ghi chú cho giao dịch...',
        noteHelp: 'Nhập tối đa 500 ký tự, có thể xuống dòng',
        noteSupport: 'Hỗ trợ emoji và ký tự đặc biệt',
        wordCount: 'từ',
        noValidToWallets: 'Không có ví đích hợp lệ (cần cùng loại tiền tệ).',
        swapWallets: 'Hoán đổi ví',
        transferring: 'Đang chuyển...',
        transferButton: 'Chuyển Tiền',
      },
      
      validation: {
        fromWalletRequired: 'Vui lòng chọn ví nguồn',
        toWalletRequired: 'Vui lòng chọn ví đích',
        differentWallets: 'Ví đích phải khác ví nguồn',
        sameCurrency: 'Hai ví phải cùng loại tiền tệ',
        amountRequired: 'Số tiền phải lớn hơn 0',
        minimumAmount: 'Số tiền tối thiểu là 1,000',
        insufficientBalance: 'Số dư không đủ để thực hiện giao dịch',
      },
      
      tips: {
        title: 'Mẹo Hữu Ích',
        tip1: 'Chỉ có thể chuyển tiền giữa các ví có cùng loại tiền tệ.',
        tip2: 'Kiểm tra kỹ số dư và thông tin ví trước khi xác nhận.',
        tip3: 'Sử dụng ghi chú để theo dõi mục đích chuyển tiền dễ dàng hơn.',
      },
      
      confirmDialog: {
        title: 'Xác nhận Chuyển Tiền',
        description: 'Vui lòng kiểm tra lại thông tin chuyển tiền trước khi xác nhận.',
        fromWallet: 'Từ ví:',
        toWallet: 'Đến ví:',
        amount: 'Số tiền:',
        note: 'Ghi chú:',
        confirm: 'Xác nhận',
      },
      
      successDialog: {
        title: 'Chuyển Tiền Thành Công!',
        description: 'Đã chuyển thành công {amount} từ ví {fromWallet} đến ví {toWallet}.',
      },
      
      actions: {
        retry: 'Thử lại',
        createWallet: 'Tạo ví mới',
      },
      
      errors: {
        errorTitle: 'Đã xảy ra lỗi',
        loadData: 'Không thể tải dữ liệu cần thiết. Vui lòng thử lại.',
        transferFailed: 'Có lỗi xảy ra khi chuyển tiền',
        noWallets: 'Bạn chưa có ví nào. Hãy tạo ví mới để bắt đầu.',
        needTwoWallets: 'Bạn cần ít nhất hai ví để thực hiện chuyển tiền.',
        notReady: 'Chưa sẵn sàng để chuyển tiền',
      },
    },

    acceptInvitation: {
      title: 'Lời Mời Chia Sẻ Ví',
      description: '{ownerName} đã mời bạn tham gia vào ví {walletName}.',
      errorTitle: 'Đã xảy ra lỗi',
      messageFrom: 'Lời nhắn từ {ownerName}:',
      currentBalance: 'Số dư hiện tại:',
      permissionGranted: 'Quyền được cấp:',
      authRequiredText: 'Bạn cần',
      or: 'hoặc',
      toAccept: 'để chấp nhận',
      accept: 'Chấp nhận',
      reject: 'Từ chối',
      backHome: 'Về trang chủ',
      acceptSuccess: 'Bạn đã chấp nhận lời mời tham gia ví "{walletName}"!',
      rejectSuccess: 'Bạn đã từ chối lời mời.',
      
      permissions: {
        view: 'Xem',
        edit: 'Chỉnh sửa & Giao dịch',
        owner: 'Chủ sở hữu',
      },
      
      errors: {
        invalidLink: 'Đường dẫn không hợp lệ hoặc thiếu token mời.',
        verifyFailed: 'Không thể xác thực lời mời.',
        invalidToken: 'Lời mời không hợp lệ, đã hết hạn hoặc đã được xử lý.',
        loginRequired: 'Vui lòng đăng nhập để chấp nhận lời mời.',
        processError: 'Đã xảy ra lỗi khi xử lý yêu cầu của bạn.',
      },
    },
  },

  // WalletSelector
  walletSelector: {
    selectWallet: 'Chọn Ví',
    total: 'Tổng',
    manageWallets: 'Quản lý ví',
  },

  // Profile & Settings
  profile: {
    title: 'Hồ Sơ Cá Nhân',
    subtitle: 'Quản lý thông tin tài khoản và cài đặt',
    avatar: 'Ảnh đại diện',
    avatarDesc: 'Nhấp vào ảnh để thay đổi.',
    avatarSupport: 'Hỗ trợ JPG, PNG. Tối đa 5MB.',
    uploading: 'Đang tải lên...',
    accountInfo: 'Thông tin tài khoản',
    accountInfoDesc: 'Cập nhật các thông tin cá nhân của bạn.',
    username: 'Tên đăng nhập',
    email: 'Email',
    firstName: 'Họ',
    firstNamePlaceholder: 'Nhập họ của bạn',
    lastName: 'Tên',
    lastNamePlaceholder: 'Nhập tên của bạn',
    phoneNumber: 'Số điện thoại',
    phoneNumberPlaceholder: 'Nhập số điện thoại',
    saving: 'Đang lưu...',
    saveButton: 'Lưu thay đổi',
    
    menu: {
      account: 'Tài khoản',
      accountDesc: 'Thông tin cá nhân và ảnh đại diện',
      security: 'Đăng nhập & bảo mật',
      securityDesc: 'Đổi mật khẩu, bảo mật tài khoản',
      appearance: 'Giao diện',
      appearanceLight: 'Chế độ sáng',
      appearanceDark: 'Chế độ tối',
      general: 'Cài đặt chung',
      generalDesc: 'Ngôn ngữ, múi giờ, định dạng',
      logout: 'Đăng xuất',
      logoutConfirm: 'Xác nhận đăng xuất',
      logoutDesc: 'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này không?',
      loggingOut: 'Đang đăng xuất...',
    },

    changePassword: {
      title: 'Bảo mật',
      subtitle: 'Quản lý mật khẩu và các tùy chọn bảo mật tài khoản.',
      changePasswordTitle: 'Đổi mật khẩu',
      changePasswordDesc: 'Nhập mật khẩu hiện tại và mật khẩu mới.',
      currentPassword: 'Mật khẩu hiện tại',
      currentPasswordPlaceholder: 'Nhập mật khẩu hiện tại',
      newPassword: 'Mật khẩu mới',
      newPasswordPlaceholder: 'Nhập mật khẩu mới',
      confirmPassword: 'Xác nhận mật khẩu mới',
      confirmPasswordPlaceholder: 'Nhập lại mật khẩu mới',
      updating: 'Đang cập nhật...',
      updateButton: 'Đổi mật khẩu',
      dangerZone: 'Khu vực nguy hiểm',
      dangerZoneDesc: 'Các hành động này không thể được hoàn tác.',
      deleteAccount: 'Xóa tài khoản',
      deleteAccountDesc: 'Xóa vĩnh viễn tài khoản và tất cả dữ liệu.',
      deleting: 'Đang xóa...',
      deleteButton: 'Xóa tài khoản',
      deleteConfirm: {
        title: 'Bạn có chắc chắn muốn xóa tài khoản?',
        description: 'Hành động này không thể hoàn tác. Để xác nhận, vui lòng nhập chính xác cụm từ {phrase} vào ô bên dưới.',
        placeholder: 'xóa tài khoản',
        confirm: 'Tôi hiểu, xóa tài khoản',
      },
      validationErrors: {
        passwordMismatch: 'Mật khẩu xác nhận không khớp',
      },
      successMessage: 'Đổi mật khẩu thành công!',
      updateError: 'Đổi mật khẩu thất bại',
      deleteAccountError: 'Xóa tài khoản thất bại từ component',
    },
  },

  // Currency
  currency: {
    title: 'Tỉ Giá Tham Khảo',
    subtitle: 'Tỉ giá các đồng tiền phổ biến so với Việt Nam Đồng (VND)',
    lastUpdated: 'Cập nhật {time}',
    updating: 'Đang cập nhật...',
    
    converter: {
      title: 'Chuyển Đổi Tiền Tệ',
      subtitle: 'Đổi tiền Việt Nam sang các ngoại tệ',
      vndAmount: 'Số tiền (VND)',
      vndAmountPlaceholder: 'Nhập số tiền VND',
      convertTo: 'Chuyển sang',
      result: 'Kết quả',
    },

    rates: {
      title: 'Tỷ Giá Hôm Nay',
      subtitle: 'Tỷ giá các đồng tiền phổ biến quy đổi sang VND',
      convertTo: '1 {currency} đổi sang VND',
    },

    errors: {
      loadingError: 'Lỗi',
      noDataForVND: 'Không có dữ liệu tỉ giá cho VND.',
    },
  },

  // Reports
  reports: {
    title: 'Báo Cáo & Thống Kê',
    subtitle: 'Phân tích chi tiêu và theo dõi tình hình tài chính của bạn',

    tabs: {
      transactions: 'Giao Dịch',
      today: 'Hôm Nay',
      budget: 'Ngân Sách',
      emailSettings: 'Báo Cáo Email',
    },

    filter: {
      title: 'Bộ Lọc & Tìm Kiếm',
      fromDate: 'Từ ngày',
      toDate: 'Đến ngày',
      fromDatePlaceholder: 'Chọn ngày bắt đầu',
      toDatePlaceholder: 'Chọn ngày kết thúc',
      wallet: 'Ví',
      walletPlaceholder: 'Chọn ví',
      allWallets: 'Tất cả ví',
      fromAmount: 'Từ số tiền',
      toAmount: 'Đến số tiền',
      noLimit: 'Không giới hạn',
      filterData: 'Lọc Dữ Liệu',
      clearFilters: 'Xóa Bộ Lọc',
      totalLabel: 'Tổng',
      filteredByAmount: 'Đã lọc theo số tiền',
    },

    table: {
      stt: 'STT',
      date: 'Ngày Thu Chi',
      amount: 'Số Tiền',
      description: 'Ghi Chú',
      wallet: 'Ví',
      noData: 'Không có dữ liệu',
    },

    transactions: {
      title: 'Báo Cáo Giao Dịch',
      totalLabel: 'Tổng: {amount}',
      exportButton: 'Báo Cáo Giao Dịch',
      
      table: {
        index: 'STT',
        date: 'Ngày Thu Chi',
        amount: 'Số Tiền',
        description: 'Ghi Chú',
        wallet: 'Ví',
      },

      noData: 'Không có dữ liệu',
    },

    today: {
      title: 'Thống Kê Hôm Nay ({date})',
      totalLabel: 'Tổng: {amount}',
      
      table: {
        index: 'STT',
        amount: 'Số Tiền',
        description: 'Ghi Chú',
        wallet: 'Ví',
      },

      noTransactions: 'Không có giao dịch nào hôm nay',
    },

    budget: {
      title: 'Báo Cáo Ngân Sách',
      selectMonth: 'Chọn tháng',
      view: 'Xem',
      
      stats: {
        budget: 'Ngân sách',
        income: 'Đã thu',
        expense: 'Đã chi',
        remaining: 'Còn lại',
      },

      table: {
        index: 'STT',
        date: 'Ngày Thu Chi', 
        amount: 'Số Tiền',
        description: 'Ghi Chú',
        wallet: 'Ví',
      },

      noData: 'Không có dữ liệu',
      noBudgetData: 'Chưa có dữ liệu ngân sách cho tháng này',
    },

    emailSettings: {
      title: 'Cài Đặt Báo Cáo Email',
      loading: 'Đang tải cài đặt...',
      notConfigured: 'Chưa cài đặt',
      emailTo: 'Email nhận: {email}',
      sendTime: 'Giờ gửi: {hour}h{minute}',
      noSettings: 'Chưa có cấu hình email',
      
      monthlyReport: {
        title: 'Báo Cáo Hàng Tháng',
        description: 'Gửi báo cáo tóm tắt tài chính hàng tháng qua email',
        enabled: 'Đã kích hoạt',
        disabled: 'Chưa kích hoạt',
        activate: 'Kích Hoạt',
        deactivate: 'Tắt',
        activateSuccess: 'Đã kích hoạt báo cáo hàng tháng',
        deactivateSuccess: 'Đã tắt báo cáo hàng tháng',
        settingsError: 'Không thể lưu cài đặt',
      },

      content: {
        title: 'Nội Dung Báo Cáo Email',
        item1: 'Tổng số tiền ban đầu trong kỳ',
        item2: 'Tổng số tiền còn lại hiện tại',
        item3: 'Danh sách chi tiết các giao dịch đã thực hiện',
        item4: 'Phân tích xu hướng chi tiêu',
      },
    },

    helpers: {
      addToWallet: 'Nạp tiền vào ví {walletName}',
      defaultIncome: 'Khoản thu',
      defaultExpense: 'Khoản chi',
      pagination: 'Trang {current} / {total}',
      errors: {
        loadingError: 'Không thể tải cài đặt email',
      },
    },

    errors: {
      loadingError: 'Lỗi khi lấy dữ liệu',
      budgetError: 'Lỗi khi lấy dữ liệu ngân sách:',
    },

    export: {
      exportFile: 'Xuất File',
      exportTitle: 'Xuất {title}',
      fileFormat: 'Định dạng file',
      transactionReport: 'Báo Cáo Giao Dịch',
      exporting: 'Đang xuất...',
      exportFormat: 'Xuất {format}',
      success: 'Đã xuất {title} thành công!',
      errors: {
        missingParams: 'Thiếu tham số thời gian để xuất báo cáo',
        exportFailed: 'Có lỗi xảy ra khi xuất dữ liệu',
      },
    },

    email: {
      emailSettings: 'Cài Đặt Email',
      emailReportSettings: 'Cài Đặt Báo Cáo Email',
      targetEmail: 'Email nhận báo cáo',
      sendHour: 'Giờ gửi',
      sendMinute: 'Phút gửi',
      dailyReport: 'Báo cáo hàng ngày',
      weeklyReport: 'Báo cáo hàng tuần',
      monthlyReport: 'Báo cáo hàng tháng',
      weekDay: 'Thứ (1-7)',
      monthDay: 'Ngày trong tháng (1-31)',
      saving: 'Đang lưu...',
      sending: 'Đang gửi...',
      saveSettings: 'Lưu Cài Đặt',
      sendNow: 'Gửi Ngay',
      warnings: {
        loadSettingsFailed: 'Không thể tải cài đặt email',
      },
      errors: {
        invalidEmail: 'Vui lòng nhập địa chỉ email hợp lệ!',
        emailRequired: 'Vui lòng nhập email nhận báo cáo trước khi gửi!',
        invalidEmailFormat: 'Vui lòng nhập địa chỉ email hợp lệ!',
        sendFailed: 'Gửi email thất bại',
        saveFailed: 'Có lỗi xảy ra khi lưu cài đặt',
      },
      success: {
        settingsSaved: 'Đã lưu cài đặt email thành công!',
        emailSent: 'Đã gửi email báo cáo ngay lập tức!',
      },
    },
  },

  // Error Page
  error: {
    notFound: {
      title: '404',
      subtitle: 'Trang không tìm thấy',
      description: 'Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.',
      instruction: 'Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.',
      homeButton: 'Về trang chủ',
      backButton: 'Quay lại',
    },
  },

  // Date Format Demo
  dateFormatDemo: {
    currentFormat: 'Định dạng hiện tại',
    formatDate: 'Định dạng ngày (formatDate)',
    formatDateTime: 'Định dạng ngày và giờ (formatDateTime)',
    input: 'Input: {date}',
    output: 'Output: {result}',
    note: 'Lưu ý: Định dạng sẽ thay đổi theo cài đặt ngôn ngữ và khu vực của bạn.',
  },

  // Validation Utils (for error messages)
  validation: {
    passwordRequired: 'Mật khẩu là bắt buộc',
    passwordMinLength: 'Mật khẩu phải có ít nhất 6 ký tự',
    passwordMaxLength: 'Mật khẩu không được vượt quá 8 ký tự',
    emailInvalid: 'Email không hợp lệ',
  },

  // Settings Page
  settings: {
    title: 'Cài Đặt',
    subtitle: 'Tùy chỉnh các thiết lập cho ứng dụng của bạn.',
    
    // Tabs
    tabs: {
      interface: 'Cài Đặt Giao Diện',
      language: 'Cài Đặt Ngôn Ngữ',
      format: 'Định Dạng',
    },

    // Interface Settings
    interface: {
      displayMode: 'Chế Độ Hiển Thị',
      displayModeDesc: 'Chọn chế độ sáng, tối hoặc theo hệ thống',
      light: 'Sáng',
      lightDesc: 'Giao diện sáng cho ban ngày',
      dark: 'Tối',
      darkDesc: 'Giao diện tối cho ban đêm',
      system: 'Theo hệ thống',
      systemDesc: 'Tự động theo cài đặt hệ thống',
      
      primaryColor: 'Màu Chủ Đạo',
      primaryColorDesc: 'Chọn màu chủ đạo cho giao diện',
      blue: 'Xanh dương',
      green: 'Xanh lá',
      purple: 'Tím',
      red: 'Đỏ',
      orange: 'Cam',
      pink: 'Hồng',

      interfaceInfo: 'Thông Tin',
      interfaceInfoList: [
        'Cài đặt giao diện được lưu tự động trong trình duyệt',
        'Chế độ "Theo hệ thống" sẽ tự động chuyển đổi theo cài đặt thiết bị',
        'Màu chủ đạo ảnh hưởng đến các nút và liên kết quan trọng'
      ]
    },

    // Language Settings
    language: {
      chooseLanguage: 'Chọn Ngôn Ngữ',
      chooseLanguageDesc: 'Ngôn ngữ được lưu tự động và áp dụng cho toàn bộ ứng dụng',
      vietnamese: 'Tiếng Việt',
      english: 'Tiếng Anh',

      languageInfo: 'Thông Tin',
      languageInfoList: [
        'Ngôn ngữ được lưu tự động trong trình duyệt',
        'Thay đổi ngôn ngữ sẽ áp dụng ngay lập tức',
        'Hỗ trợ tiếng Việt và tiếng Anh'
      ]
    },

    // Format Settings
    format: {
      currencyFormat: 'Định Dạng Tiền Tệ',
      currencyFormatDesc: 'Chọn cách hiển thị dấu phân cách cho số tiền.',
      dotSeparator: 'Dấu chấm',
      dotExample: '1.000.000',
      commaSeparator: 'Dấu phẩy', 
      commaExample: '1,000,000',

      dateFormat: 'Định Dạng Ngày Tháng',
      dateFormatDesc: 'Chọn cách hiển thị ngày tháng trong toàn bộ ứng dụng.',
      dayMonthYear: 'Ngày/Tháng/Năm',
      monthDayYear: 'Tháng/Ngày/Năm',
      yearMonthDay: 'Năm/Tháng/Ngày',

      previewFormat: 'Xem Trước Định Dạng',
      previewFormatDesc: 'Xem cách ngày tháng sẽ được hiển thị với định dạng hiện tại.',
    },

    // Messages
    messages: {
      updateSuccess: 'Cập nhật cài đặt thành công!',
      updateError: 'Lỗi khi cập nhật cài đặt.',
    }
  },

  // Dashboard
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Tổng quan tài chính của bạn - Cập nhật',
    selectWallet: 'Chọn ví để xem',
    allWallets: 'Tất cả các ví',
    totalBalance: 'Tổng Số Dư',
    monthlyIncome: 'Thu Nhập Tháng',
    monthlyExpense: 'Chi Tiêu Tháng', 
    totalWallets: 'Tổng số ví',
    monthlyGrowth: 'Tăng Trưởng Tháng',
    totalTransactions: 'Tổng Giao Dịch Tháng',
    income: 'Thu Nhập',
    expense: 'Chi Tiêu',
    totalIncome: 'Tổng Thu Nhập',
    totalExpense: 'Tổng Chi Tiêu',
    savings: 'Tiết Kiệm',
    incomeVsExpense: 'Thu Nhập vs Chi Tiêu',
    trendAnalysis: 'Xu hướng tài chính 9 tháng gần nhất',
    weeklySpending: 'Chi Tiêu Theo Tuần',
    weeklySpendingDesc: 'Thói quen chi tiêu hàng ngày',
    dailySpending: 'Chi Tiêu Hàng Ngày',
    recentTransactions: 'Giao Dịch Gần Đây',
    recentTransactionsDesc: '5 giao dịch mới nhất',
    topCategories: 'Danh Mục Chi Tiêu Hàng Đầu',
    topCategoriesDesc: 'Các khoản chi lớn nhất tháng này',
    categoryBreakdown: 'Chi Tiêu Theo Danh Mục',
    categoryBreakdownDesc: 'Phân tích chi tiêu tháng này',
    quickActions: 'Hành Động Nhanh',
    quickActionsDesc: 'Các thao tác thường dùng',
    addWallet: 'Thêm Ví Mới',
    addWalletDesc: 'Tạo ví mới để quản lý',
    addCategory: 'Thêm Danh Mục Thu Chi',
    addCategoryDesc: 'Thêm, sửa, xóa danh mục',
    viewWalletList: 'Xem Danh Sách Ví',
    viewWalletListDesc: 'Quản lý tất cả ví',
    noTransactions: 'Không có giao dịch nào gần đây.',
    noSpending: 'Không có chi tiêu nào trong tháng này.',
    noCategories: 'Không có chi tiêu nào.',
    loadingDashboard: 'Đang tải dữ liệu dashboard...',
    errors: {
      loadData: 'Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.',
    },
  },

  // Profile
  profile: {
    account: 'Tài khoản',
    personalInfo: 'Thông tin cá nhân',
    personalInfoDesc: 'Quản lý thông tin và tài khoản của bạn',
    security: 'Bảo mật',
    changePassword: 'Đổi mật khẩu',
    changePasswordDesc: 'Cập nhật mật khẩu của bạn',
    appearance: 'Giao diện',
    darkMode: 'Chế độ tối',
    darkModeDesc: 'Bật/tắt chế độ tối',
    language: 'Ngôn ngữ',
    appLanguage: 'Ngôn ngữ ứng dụng',
    appLanguageDesc: 'Thay đổi ngôn ngữ hiển thị',
    appSettings: 'Cài đặt ứng dụng',
    appSettingsDesc: 'Tùy chỉnh cài đặt ứng dụng',
    logout: 'Đăng xuất',
    logoutDesc: 'Đăng xuất khỏi tài khoản',
    logoutConfirm: 'Bạn có chắc chắn muốn đăng xuất?',
    logoutConfirmDesc: 'Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng ứng dụng.',
    verified: 'Đã xác minh',
  },

  // Error Page
  error: {
    pageNotFound: 'Không Tìm Thấy Trang',
    pageNotFoundDesc: 'Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.',
    goHome: 'Về Trang Chủ',
    goBack: 'Quay Lại',
    error404: '404',
  },

  // Currency Page
  currency: {
    title: 'Tỷ Giá Hối Đoái',
    subtitle: 'Theo dõi tỷ giá và chuyển đổi tiền tệ',
    conversion: 'Chuyển Đổi Tiền Tệ',
    conversionDesc: 'Đổi tiền Việt Nam sang các ngoại tệ',
    amountVND: 'Số tiền (VND)',
    amountVNDPlaceholder: 'Nhập số tiền VND',
    convertTo: 'Chuyển sang',
    result: 'Kết quả',
    todayRates: 'Tỷ Giá Hôm Nay',
    todayRatesDesc: 'Tỷ giá các đồng tiền phổ biến quy đổi sang VND',
    noRateData: 'Không có dữ liệu tỉ giá cho VND.',
    rateError: 'Lỗi khi tải tỷ giá',
  },

  // Sidebar
  sidebar: {
    themeTooltip: 'Chế độ tối/sáng',
    settingsTooltip: 'Cài đặt', 
    logoutTooltip: 'Đăng xuất',
    logoutConfirm: 'Xác nhận đăng xuất',
    logoutConfirmDesc: 'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?',
  },

  // Wallet Panel
  walletPanel: {
    title: 'Danh Sách Ví & Danh mục',
    loadingWallets: 'Đang tải danh sách ví...',
    currentWallet: 'Ví hiện tại',
    noWallets: 'Chưa có ví nào',
    categories: 'Danh Mục',
    manage: 'Quản lý',
  },

  // Notifications
  notifications: {
    title: 'Thông Báo',
    subtitle: 'Các cập nhật và cảnh báo gần đây.',
    noNotifications: 'Bạn không có thông báo mới.',
  },

  // Date Format Demo
  dateFormatDemo: {
    currentFormat: 'Định dạng hiện tại',
    today: 'Hôm nay',
    yesterday: 'Hôm qua',
    lastWeek: 'Tuần trước',
    currentTime: 'Thời gian hiện tại',
    howToChange: 'Cách thay đổi',
    howToChangeList: [
      'Thay đổi định dạng ngày trong Settings → Định Dạng',
      'Tất cả ngày trong ứng dụng sẽ tự động cập nhật theo định dạng mới',
      'Định dạng sẽ được lưu và áp dụng cho toàn bộ ứng dụng'
    ]
  },

  // Auth
  auth: {
    welcomeToXSpend: 'Chào mừng đến với XSPEND',
    emailPlaceholder: 'Nhập email của bạn',
    passwordPlaceholder: 'Nhập mật khẩu',
    loginButton: 'Đăng Nhập',
    registerButton: 'Đăng Ký',
    forgotPassword: 'Quên mật khẩu?',
    orLoginWith: 'Hoặc đăng nhập bằng',
    noAccount: 'Chưa có tài khoản?',
    hasAccount: 'Đã có tài khoản?',
    createAccount: 'Tạo tài khoản',
    loginHere: 'Đăng nhập tại đây',
  },

  // Notifications  
  notifications: {
    title: 'Thông báo',
    noNotifications: 'Không có thông báo nào',
    markAllRead: 'Đánh dấu tất cả đã đọc',
  },

  // Reports
  reports: {
    title: 'Báo Cáo',
    transactions: 'Giao Dịch',
    today: 'Hôm Nay',
    budget: 'Ngân Sách',
    emailSettings: 'Báo Cáo Email',
  },

  // Wallet
  wallet: {
    title: 'Ví Tiền',
    addWallet: 'Thêm Ví',
    balance: 'Số dư',
    income: 'Thu nhập',
    expense: 'Chi tiêu',
    transactions: 'Giao dịch',
  },

  // Transactions
  transactions: {
    title: 'Quản Lý Thu Chi',
    subtitle: 'Theo dõi, phân loại và quản lý tất cả các khoản thu chi của bạn tại một nơi.',
    
    // Tabs
    tabs: {
      transactions: 'Giao Dịch',
      categories: 'Danh Mục Chi Tiêu'
    },

    // Transaction List
    list: {
      title: 'Danh Sách Giao Dịch',
      empty: {
        title: 'Chưa có giao dịch nào',
        subtitle: 'Không tìm thấy giao dịch nào phù hợp với bộ lọc của bạn.'
      },
      defaultIncome: 'Khoản thu nhập',
      defaultExpense: 'Khoản chi tiêu',
      uncategorized: 'Chưa phân loại'
    },

    // Summary
    summary: {
      title: 'Tổng Quan',
      subtitle: 'Tổng hợp thu chi trong kỳ này',
      totalIncome: 'Tổng Thu',
      totalExpense: 'Tổng Chi',
      balance: 'Cân Bằng'
    },

    // Actions
    actions: {
      title: 'Hành Động',
      addExpense: 'Chi Tiêu',
      addIncome: 'Thu Nhập',
      viewReports: 'Xem Báo Cáo Chi Tiết'
    },

    // Filters
    filters: {
      title: 'Bộ Lọc',
      byCategory: 'Lọc theo danh mục',
      byDate: 'Lọc theo ngày',
      selectCategory: 'Chọn danh mục',
      allCategories: 'Tất cả danh mục',
      selectDate: 'Chọn ngày',
      quickSelect: 'Chọn ngày nhanh',
      today: 'Hôm nay',
      yesterday: 'Hôm qua'
    },

    // Add/Edit Transaction Modal
    modal: {
      addTitle: 'Thêm Giao Dịch',
      editTitle: 'Chỉnh Sửa Giao Dịch',
      
      form: {
        amount: 'Số tiền',
        amountPlaceholder: '0',
        category: 'Danh mục',
        categoryPlaceholder: 'Chọn danh mục',
        wallet: 'Ví',
        walletPlaceholder: 'Chọn ví',
        description: 'Ghi chú',
        descriptionPlaceholder: {
          income: 'Ghi chú về khoản thu...',
          expense: 'Ghi chú về khoản chi...'
        },
        date: 'Thời gian',
        datePlaceholder: 'Chọn ngày và giờ',
        
        // Form hints
        descriptionHints: {
          maxLength: 'Nhập tối đa 500 ký tự, có thể xuống dòng',
          features: 'Hỗ trợ emoji và ký tự đặc biệt',
          wordCount: 'từ'
        },

        // Submit buttons
        addIncome: 'Thêm Khoản Thu',
        addExpense: 'Thêm Khoản Chi',
        updateTransaction: 'Cập Nhật Giao Dịch',
        deleteTransaction: 'Xóa Giao Dịch'
      },

      // Validation errors
      validation: {
        amountRequired: 'Vui lòng nhập số tiền',
        amountInvalid: 'Số tiền không hợp lệ',
        amountExceedsBalance: 'Số tiền không được vượt quá số dư hiện tại',
        categoryRequired: 'Vui lòng chọn danh mục',
        walletRequired: 'Vui lòng chọn ví',
        dateRequired: 'Vui lòng chọn thời gian',
        descriptionTooLong: 'Ghi chú không được vượt quá 500 ký tự'
      },

      // Confirmation dialogs
      confirmDelete: {
        title: 'Xác nhận xóa giao dịch',
        description: 'Bạn có chắc chắn muốn xóa giao dịch này không? Hành động này không thể hoàn tác.',
        confirm: 'Xóa',
        cancel: 'Hủy'
      },

      confirmFutureDate: {
        title: 'Xác nhận ngày tương lai',
        description: 'Bạn đã chọn giao dịch vào thời gian',
        futureDate: '(ngày tương lai)',
        transactionInfo: 'Thông tin giao dịch:',
        transactionType: 'Loại',
        transactionAmount: 'Số tiền',
        transactionDate: 'Ngày',
        confirmMessage: 'Bạn có chắc chắn muốn tiếp tục?',
        confirm: 'Tiếp tục',
        cancel: 'Hủy'
      }
    },

    // Categories Management
    categories: {
      title: 'Quản Lý Danh Mục',
      addCategory: 'Thêm Danh Mục',
      editCategory: 'Chỉnh Sửa Danh Mục',
      deleteCategory: 'Xóa Danh Mục',
      viewCategory: 'Xem Chi Tiết',
      
      form: {
        name: 'Tên danh mục',
        namePlaceholder: 'VD: Ăn uống, Di chuyển...',
        description: 'Ghi chú',
        descriptionPlaceholder: 'Nhập ghi chú (tùy chọn)',
        budgetAmount: 'Ngân sách chi tiêu hàng tháng (tùy chọn)',
        budgetAmountPlaceholder: 'VD: 5000000',
        incomeTargetAmount: 'Mục tiêu thu nhập hàng tháng (tùy chọn)',
        incomeTargetAmountPlaceholder: 'VD: 10000000',
        add: 'Thêm',
        edit: 'Lưu Thay Đổi',
        cancel: 'Hủy',
        
        validation: {
          nameRequired: 'Tên danh mục không được để trống',
          nameTooLong: 'Tên danh mục không được vượt quá 100 ký tự',
          descriptionTooLong: 'Mô tả không được vượt quá 500 ký tự'
        }
      },

      stats: {
        totalTransactions: 'Tổng giao dịch',
        totalAmount: 'Tổng số tiền',
        budgetUsed: 'Đã sử dụng',
        budgetRemaining: 'Còn lại',
        incomeProgress: 'Tiến độ thu nhập'
      },

      empty: {
        title: 'Chưa có giao dịch nào',
        subtitle: 'Chưa có giao dịch nào được ghi nhận cho danh mục này.',
        chart: 'Chưa có dữ liệu thu chi.',
        categories: 'Chưa có danh mục nào',
        categoriesSubtitle: 'Hãy bắt đầu bằng cách thêm danh mục đầu tiên.'
      },

      progress: {
        spent: 'Đã chi',
        earned: 'Đã thu',
        remaining: 'Còn lại'
      },

      status: {
        notSet: 'Không đặt',
        noBudgetOrTarget: 'Chưa đặt ngân sách hoặc mục tiêu'
      },

      summary: {
        totalIncome: 'Tổng Thu',
        totalExpense: 'Tổng Chi',
        balance: 'Cân Bằng',
        overview: 'Tổng quan',
        history: 'Lịch sử giao dịch'
      },

      detail: {
        title: 'Chi Tiết Danh Mục',
        subtitle: 'Tổng quan thu chi và danh sách giao dịch.'
      },

      confirmDelete: {
        title: 'Bạn có chắc chắn muốn xóa?',
        description: 'Hành động này không thể hoàn tác. Tất cả các giao dịch thuộc danh mục {categoryName} sẽ được gỡ bỏ khỏi danh mục này.',
        instruction: 'Để xác nhận, vui lòng nhập {categoryName} vào ô bên dưới.',
        inputPlaceholder: 'Nhập tên danh mục để xác nhận',
        confirm: 'Xóa Danh Mục',
        cancel: 'Hủy'
      },

      confirmLargeAmount: {
        title: 'Xác nhận số tiền lớn',
        budgetMessage: 'Ngân sách chi tiêu của bạn là {amount} VND (hơn 100 tỉ). Bạn có chắc chắn muốn tiếp tục?',
        incomeMessage: 'Mục tiêu thu nhập của bạn là {amount} VND (hơn 100 tỉ). Bạn có chắc chắn muốn tiếp tục?',
        confirmMessage: 'Bạn có chắc chắn muốn tiếp tục với số tiền này?',
        confirm: 'Xác nhận',
        cancel: 'Hủy'
      }
    },

    // Edit Transaction
    edit: {
      title: 'Chi Tiết',
      incomeTitle: 'Giao Dịch Thu',
      expenseTitle: 'Giao Dịch Chi',
      subtitle: 'Chỉnh sửa hoặc xóa giao dịch của bạn tại đây.',
      
      form: {
        amount: 'Số tiền',
        amountPlaceholder: 'Nhập số tiền',
        category: 'Danh mục',
        categoryPlaceholder: 'Chọn danh mục',
        wallet: 'Ví',
        walletPlaceholder: 'Chọn ví',
        description: 'Ghi chú',
        descriptionPlaceholder: 'Nhập ghi chú (tùy chọn)',
        date: 'Ngày & Giờ',
        cancel: 'Hủy',
        save: 'Lưu Thay Đổi',
        delete: 'Xóa Giao Dịch'
      },

      validation: {
        invalidAmount: 'Số tiền không hợp lệ',
        amountExceedsBalance: 'Số tiền không được vượt quá số dư hiện tại ({balance})',
        descriptionTooLong: 'Ghi chú quá dài (tối đa 500 ký tự)',
        fieldNameDescription: 'Ghi chú'
      },

      confirmDelete: {
        title: 'Xóa giao dịch này?',
        description: 'Hành động này sẽ xóa giao dịch vĩnh viễn và không thể hoàn tác.',
        confirm: 'Xóa',
        cancel: 'Hủy'
      },

      confirmFutureDate: {
        title: 'Xác nhận ngày tương lai',
        description: 'Bạn đang cập nhật giao dịch với ngày {date} (ngày tương lai).',
        transactionInfo: 'Thông tin giao dịch:',
        transactionType: 'Loại',
        transactionAmount: 'Số tiền',
        transactionDate: 'Ngày',
        confirmMessage: 'Bạn có chắc chắn muốn tiếp tục?',
        confirm: 'Xác nhận',
        cancel: 'Chọn lại ngày'
      }
    },

    // Toast messages
    messages: {
      transactionAdded: 'Đã thêm giao dịch thành công',
      transactionUpdated: 'Đã cập nhật giao dịch thành công',
      transactionDeleted: 'Đã xóa giao dịch thành công',
      categoryAdded: 'Đã thêm danh mục thành công',
      categoryUpdated: 'Đã cập nhật danh mục thành công',
      categoryDeleted: 'Đã xóa danh mục thành công',
      budgetExceeded: 'Bạn đã chi tiêu vượt ngân sách cho danh mục',
      incomeTargetReached: 'Chúc mừng! Bạn đã đạt mục tiêu thu nhập cho danh mục này',
      
      errors: {
        loadTransactions: 'Không thể tải danh sách giao dịch',
        loadCategories: 'Không thể tải danh sách danh mục',
        loadCategoryDetails: 'Không tìm thấy danh mục để xem',
        addTransaction: 'Có lỗi xảy ra khi thêm giao dịch',
        updateTransaction: 'Có lỗi xảy ra khi cập nhật giao dịch',
        deleteTransaction: 'Có lỗi xảy ra khi xóa giao dịch',
        addCategory: 'Có lỗi xảy ra khi thêm danh mục',
        updateCategory: 'Có lỗi xảy ra khi cập nhật danh mục',
        deleteCategory: 'Có lỗi xảy ra khi xóa danh mục',
        general: 'Có lỗi xảy ra'
      }
    }
  },

  // Time
  time: {
    today: 'Hôm nay',
    yesterday: 'Hôm qua',
    thisWeek: 'Tuần này',
    lastWeek: 'Tuần trước',
    thisMonth: 'Tháng này',
    lastMonth: 'Tháng trước',
    thisYear: 'Năm này',
    lastYear: 'Năm ngoái',
  },

  // Charts
  charts: {
    balanceTrend: {
      date: 'Ngày',
      balance: 'Số dư',
    },
  },

  // Date Format Demo
  dateFormatDemo: {
    formatDate: 'Định dạng ngày (formatDate)',
    input: 'Input: {date}',
    output: 'Output: {result}',
  },
};
