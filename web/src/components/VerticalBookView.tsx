// SPDX-FileCopyrightText: 2020 mtgto <hogerappa@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

import Box from "@mui/material/Box";
import type { History } from "history";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { useInView } from "react-intersection-observer";
import { useHistory } from "rocon/react";
import type { Book } from "../domain/book.ts";
import NavigationPage from "./NavigationPage.tsx";

type Props = Readonly<{
  pageIndex: number;
  book: Book;
  nextBook?: Book;
  onNextBook: () => void;
  onRandom: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}>;

const Page = (
  props: Readonly<{
    index: number;
    book: Book;
    history: History;
    refs: RefObject<HTMLElement[]>;
    loading: HTMLImageElement["loading"];
    onClick: (e: React.MouseEvent) => void;
  }>,
) => {
  const { ref: inViewRef } = useInView({
    onChange: (inView) => {
      if (inView) {
        props.history.replace({
          hash: props.index === 0 ? "" : `${props.index}`,
        });
      }
    },
  });
  const setRefs = useCallback(
    (element: HTMLElement) => {
      props.refs.current[props.index] = element;
      inViewRef(element);
    },
    [inViewRef, props],
  );
  return (
    <Box
      ref={setRefs}
      component="img"
      loading={props.loading}
      src={`/images/books/${props.book.id}/pages/${props.index}`}
      onClick={props.onClick}
      sx={{
        display: "block",
        mx: "auto",
        my: 1,
        minHeight: "200px",
        maxWidth: "720px",
      }}
    />
  );
};

const pages = (
  currentPageIndex: number,
  book: Book,
  history: History,
  refs: RefObject<HTMLElement[]>,
  onPreviousPage: () => void,
  onNextPage: () => void,
) => {
  const onClick = (e: React.MouseEvent) => {
    if (e.shiftKey) {
      onPreviousPage();
    } else {
      onNextPage();
    }
  };
  return [...Array(book.pageCount).keys()].map((i: number) => (
    <Page
      key={i}
      index={i}
      book={book}
      history={history}
      refs={refs}
      loading={Math.abs(currentPageIndex - i) <= 1 ? "eager" : "lazy"}
      onClick={onClick}
    />
  ));
};

const VerticalBookView = (props: Props) => {
  const refs = useRef<HTMLElement[]>([]);
  const history = useHistory();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (props.pageIndex !== 0 && refs.current && refs.current[props.pageIndex]) {
      if (scrolled) {
        refs.current[props.pageIndex].scrollIntoView({ behavior: "smooth" });
      } else {
        refs.current[props.pageIndex].scrollIntoView();
        setScrolled(true);
      }
    } else if (refs.current && refs.current[0]) {
      refs.current[0].scrollIntoView();
    }
  }, [props.book, props.pageIndex, scrolled]);

  return (
    <Box sx={{ mx: "auto" }}>
      {pages(props.pageIndex, props.book, history, refs, props.onPreviousPage, props.onNextPage)}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100vh",
        }}
      >
        <NavigationPage
          book={props.book}
          nextBook={props.nextBook}
          onNextBook={props.onNextBook}
          onRandom={props.onRandom}
        />
      </Box>
    </Box>
  );
};

export default VerticalBookView;
