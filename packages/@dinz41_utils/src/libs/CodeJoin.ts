export default class CodeJoin extends Array {
  protected joinData: JoinData = {};
  useInline(inlineChar = " ") {
    this.joinData.inline = { joinChar: inlineChar };
    return this;
  }
  useListLine(end = "", begin = "") {
    this.joinData.listLine = { begin, end };
    return this;
  }
  useScope(begin = "", end = "") {
    this.joinData.scope = { begin, end };
    return this;
  }
  add(...childs) {
    this.push(...childs);
    return this;
  }
  addEmptyLine() {
    this.push(" ");
    return this;
  }
  getContent(tabChar = "\t") {
    const content = new ContentJoin(tabChar);
    join(this);
    return content.join("");
    // ----------------------------------------------
    function join(list: CodeJoin) {
      const data = list.joinData;
      if (data.inline) return joinInline(list);
      if (data.scope) return joinScope(list);
      return joinLines(list);
    }
    function joinInline(list: CodeJoin) {
      const listContent = [];
      list.forEach((content) => {
        const [str, list] = getElContent(content);
        if (list) return join(list);
        if (str) listContent.push(str);
      });
      if (!listContent.length) return;
      content.addLine(listContent.join(this.inline || " "));
    }
    function joinLines(list: CodeJoin) {
      const begin = list.joinData.listLine?.begin || "";
      const end = list.joinData.listLine?.end || "";
      list.forEach((el) => {
        const [str, list] = getElContent(el);
        if (list) return join(list);
        if (str) content.addLine(begin + str + end);
      });
    }
    function joinScope(list: CodeJoin) {
      const { scope } = list.joinData;
      if (scope.begin) content.addLine(scope.begin);
      content.incTab();
      joinLines(list);
      content.descTab();
      if (scope.end) content.addLine(scope.end);
    }
    function getElContent(content: any): [string, CodeJoin] {
      if (content == null) return ["", null];
      if (content instanceof CodeJoin) return ["", content];
      return [`${content}`, null];
    }
  }
}

class ContentJoin extends Array {
  #tabLength = 0;
  #tab = "";
  #tabChar = "";

  constructor(tabChar: string = "\t") {
    super();
    this.#tabChar = tabChar;
  }
  get tab() {
    return this.#tab;
  }
  incTab(incValue = 1) {
    this.#tabLength += incValue;
    if (this.#tabLength < 0) this.#tabLength = 0;
    this.#tab = this.#tabChar.repeat(this.#tabLength);
    return this;
  }
  addLine(line) {
    if (line == null) return;
    if (line === "") return;
    this.push(`${this.#tab}${line}\n`);
  }
  descTab(descValue = 1) {
    return this.incTab(-descValue);
  }
}

type JoinData = {
  inline?: { joinChar?: string };
  listLine?: { begin?: string; end?: string };
  scope?: { begin?: string; end?: string };
};
