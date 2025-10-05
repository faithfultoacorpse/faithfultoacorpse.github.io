
class HTMLFormatter:
    def __init__(self):
        self.article_start = "<article>"
        self.article_end = "</article>"
        self.article_header = "<div class=\"article-header\">"
        self.article_content = "<div class=\"article-content\">"
        self.div_end = "</div>"
        self.block_quote_start = "<blockquote>"
        self.block_quote_end = "</blockquote>"

        self.title= "<h1 class=\"page-title\">{}</h1>"
        self.article_meta = "<div class=\"article-meta\">{}</div>"

        self.normal_text = "<p>{}</p>"
        self.header_text = "<h2>{}</h2>"
        self.emphasize = "<em>{}</em>" 
        self.link = "<a href=\"{}\">{}</a>"
        self.image = "<img src=\"{}\" width=\"370\" height=\"40\">"

        self.return_link = "<a href=\"#\" class=\"writing-link\" data-article=\"pages/writings\">← Back to writings</a>"
        self.ornament = "<div class=\"ornament\">✻</div>"
        self.break_char = "<br>"
        self.tab = "    "

    def format_article_header(self, title, meta):
        lines = [
            self.article_start,
            f"{self.tab}{self.article_header}",
            f"{2 * self.tab}{self.title.format(title)}",
            f"{2 * self.tab}{self.article_meta.format(meta)}",
            f"{self.tab}{self.div_end}",
            f"{self.tab}{self.article_content}"
        ]
        return lines
    
    def format_block_quote(self, lines):
        block_quote = [2 * self.tab + self.block_quote_start]
        for line in lines[:-1]:
            block_quote.append(f"{3 * self.tab}{line[2:]}{self.break_char}")
        if lines[-1][0] == ">":
            block_quote.append(f"{3 * self.tab}{lines[-1][2:]}{self.break_char}")
        else:
            block_quote.append(3 * self.tab + lines[-1])
        block_quote.append(2 * self.tab + self.block_quote_end)
        return block_quote

    def format_title(self, title):
        return self.title.format(title)

    def format_normal_text(self, text):
        return 2 * self.tab + self.normal_text.format(text)

    def format_header_text(self, text):
        return 2 * self.tab + self.header_text.format(text[3:])

    def emph_text(self, text):
        return self.emphasize.format(text)

    def format_hyperlink(self, link, text):
        return self.link.format(link, text)

    def format_image(self, filepath):
        return 2 * self.tab + self.image.format(filepath)
