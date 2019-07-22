import request from '../utils/request';



//添加系统用户
export const addSysUser = (sysUser) => {
    return request({
        url: '/api/sysUser/addSysUser',
        method: 'post',
        data: sysUser
    })
}



//删除系统用户
export const delSysUser = (id) => {
    return request({
        url: '/api/sysUser/delSysUser',
        method: 'post',
        data: id
    })
}

//删除系统用户
export const batchDelSysUser = (ids) => {
    return request({
        url: '/api/sysUser/batchDelSysUser',
        method: 'post',
        data: ids
    })
}



//系统用户列表接口
export const sysUserList = (query) => {
    return request({
        url: '/api/sysUser/sysUserList',
        method: 'get',
        params: query
    })
}


//更新用户数据接口
export const updatesUserById = (updateData) => {
    return request({
        url: '/api/sysUser/updatesUserById',
        method: 'post',
        data: updateData
    })
}