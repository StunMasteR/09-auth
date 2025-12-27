import css from "./ErrorMessage.module.css"
interface ErorrMessageProps{
    error?: Error | null
}

export default function ErrorMessage({error}:ErorrMessageProps) {
    return (
<p className={css.text}>
  There was an error {error?.message && `(${error.message})`}, please try again...
</p>

    )
}