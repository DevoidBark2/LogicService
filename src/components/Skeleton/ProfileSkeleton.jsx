import React from "react";
import Skeleton from "react-loading-skeleton";

const ProfileSkeleton = () => {
    return(
        <div className="d-flex align-items-end border p-3 justify-content-between">
            <div className="d-flex">
                <div className="m-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Имя</label>
                    <Skeleton width={207} height={38} className=""/>
                </div>
                <div className="m-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Фамилия</label>
                    <Skeleton width={207} height={38}/>
                </div>
                <div className="m-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Почта</label>
                    <Skeleton width={207} height={38}/>
                </div>
                <div className="m-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Телефон</label>
                    <Skeleton width={207} height={38}/>
                </div>
            </div>
        </div>
    )
}

export {ProfileSkeleton}