import Image from "next/image"
import { Rich } from "@/components/rich"
import { Wrap } from "@/components/section-parts"
import { footer, FOOTER_DOCS, header, MAIL, NAV_LINKS } from "@/content/site"

/* ══ 08 바닥 ══ 개인정보처리방침 · 이용약관은 chanchan.kr 의 원본 문서로 연결합니다. */
export function SiteFooter() {
  const columns = [
    { title: footer.exploreTitle, links: NAV_LINKS },
    { title: footer.docsTitle, links: FOOTER_DOCS },
  ]
  return (
    <footer className="bg-cc-deep pt-[62px] pb-[70px] text-[15.5px] text-cc-sage">
      <Wrap>
        <div className="mb-[34px] grid grid-cols-1 gap-[26px] lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-[34px]">
          <div>
            <Image src="/logo.png" alt={header.logoAlt} width={48} height={48} className="mb-2 size-12" />
            <p className="text-cc-sage">{footer.tagline}</p>
            <p className="mt-3.5 text-[14.5px] text-cc-moss">
              {footer.owner}
              <br />
              <a href={`mailto:${MAIL}`} className="text-[#DCEAE1] no-underline hover:underline">
                {MAIL}
              </a>
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-[15px] text-white">{col.title}</h4>
              <ul className="flex flex-col gap-[9px]">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-[#DCEAE1] no-underline hover:underline">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="border-t border-cc-haze/20 pt-[26px] text-sm leading-[1.7] text-cc-moss">
          {footer.fine.map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              <Rich text={line} />
            </span>
          ))}
        </p>
      </Wrap>
    </footer>
  )
}
