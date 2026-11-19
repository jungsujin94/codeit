import { Fragment } from "react"

/*
  src/content/*.ts 의 문구를 그리는 작은 도우미입니다.
  · `**굵게**` → <b>굵게</b>
  · 줄바꿈(\n) → <br>
  원본 HTML 의 <b> · <br> 위치를 그대로 살리면서, 문구는 데이터 파일에 글자 그대로 둘 수 있습니다.
*/
export function Rich({ text }: { text: string }) {
  return text.split("\n").map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <b key={j}>{part.slice(2, -2)}</b>
        ) : (
          <Fragment key={j}>{part}</Fragment>
        )
      )}
    </Fragment>
  ))
}
