import React from 'react';


type PostProps = {
  name: React.ReactNode
  username: React.ReactNode
  date: React.ReactNode
  description: React.ReactNode
  image: React.ReactNode
  pfp: React.ReactNode
}

const Post = ({name, username, date, description, image, pfp,}: PostProps) => {
  return (
    <div className="p-3 w-1/3 rounded-2xl" style={{backgroundColor: 'var(--darksec)'}}>
        <div className="flex pb-3 w-full">
            <img className="rounded-full" style={{width: '50px', height: '50px'}} src={pfp}></img>
            <div className="pl-3">
                <div className="text-lg m-0 p-0" style={{color: 'var(--lightpri)'}}>{name}</div>
                <div className="flex items-center">
                    <div className="text-sm text-gray-300 m-0 p-0">{username}</div>
                    <div style={{width: '.3rem', height: '.3rem'}} className="rounded-full bg-slate-500 m-1"></div>
                    <div className="text-sm m-0 p-0" style={{color: 'var(--lightbg)'}}>{date}</div>
                </div>
            </div>
        </div>
        <img className="box h-auto object-cover m-auto rounded-md" style={{width: '400px'}} src={image}></img>
        <p className="text-sm mt-3" style={{color: 'white'}}>{description}</p>
    </div>
  )
}

export default Post;
