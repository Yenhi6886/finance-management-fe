import apiService from '../../../shared/services/apiService';

function downloadBlob(data, filename, contentType) {
  const blob = new Blob([data], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

const exportService = {
  async exportExcel(reportRequest) {
    const res = await apiService.post('/reports/export/excel', reportRequest, {
      responseType: 'arraybuffer'
    });
    // 后端通过 Content-Disposition 返回文件名
    const disposition = res.headers['content-disposition'] || res.headers['Content-Disposition'];
    let fileName = 'BaoCaoTaiChinh.xlsx';
    if (disposition) {
      const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(disposition);
      const raw = decodeURIComponent(match?.[1] || match?.[2] || '');
      if (raw) fileName = raw;
    }
    downloadBlob(res.data, fileName, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  },

  async exportPdf(reportRequest) {
    const res = await apiService.post('/reports/export/pdf', reportRequest, {
      responseType: 'arraybuffer'
    });
    const disposition = res.headers['content-disposition'] || res.headers['Content-Disposition'];
    let fileName = 'BaoCaoTaiChinh.pdf';
    if (disposition) {
      const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(disposition);
      const raw = decodeURIComponent(match?.[1] || match?.[2] || '');
      if (raw) fileName = raw;
    }
    downloadBlob(res.data, fileName, 'application/pdf');
  }
};

export default exportService;
