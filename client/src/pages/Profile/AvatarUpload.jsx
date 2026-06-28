import { useRef } from 'react'
import { Upload, X, Image, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { uploadAvatar as uploadAvatarApi } from '../../services/settingsService'
import { useAuth } from '../../context/AuthContext'

function AvatarUpload({ avatar, setAvatar }) {
  const { user } = useAuth()
  const inputRef = useRef(null)

  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return }
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB'); return }
    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = e.target.result
      try {
        await uploadAvatarApi(base64)
        setAvatar(base64)
        toast.success('Avatar updated')
      } catch {
        toast.error('Failed to upload avatar')
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }
  const handleDragOver = (e) => e.preventDefault()

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
          <Image size={16} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Avatar</h2>
      </div>

      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center overflow-hidden border-4 border-slate-200 dark:border-zinc-700">
            {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : <User size={48} className="text-indigo-400" />}
          </div>
          {avatar && (
            <button onClick={() => { setAvatar(null); toast.success('Avatar removed') }} className="absolute -top-1 -right-1 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200">
              <X size={14} />
            </button>
          )}
        </div>

        <div onDragOver={handleDragOver} onDrop={handleDrop} className="w-full max-w-xs border-2 border-dashed border-slate-300 dark:border-zinc-700 rounded-2xl p-6 text-center hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors duration-300 cursor-pointer" onClick={() => inputRef.current?.click()}>
          <Upload size={24} className="mx-auto mb-2 text-slate-400" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Click or drag to upload</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">PNG, JPG up to 2MB</p>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
        </div>
      </div>
    </div>
  )
}

export default AvatarUpload
