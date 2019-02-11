const openDownloadDialog = (url, saveName) => {
    if (typeof url === 'object' && url instanceof Blob) {
      url = URL.createObjectURL(url); // 创建blob地址
    }
    const aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = saveName;
    aLink.click();
};

/**
 * 保存CSV文件
 * @params csv csv文件内容
 * @params saveName 保存的文件名
 */
export const downloadCSV = (csv, saveName) => {
    const blob = new Blob(['\ufeff' + csv], {type: 'text/csv,charset=UTF-8'});
    openDownloadDialog(blob, `${saveName}.csv`);
}
export const downloadText = (csv, saveName) => {
    // const href = 'data:text/txt;charset=utf-8,\ufeff' + encodeURIComponent(csv); // ie浏览器不支持
    const blob = new Blob(['\ufeff' + csv], {type: 'text/tet,charset=UTF-8'});
    openDownloadDialog(blob, `${saveName}.txt`);
}