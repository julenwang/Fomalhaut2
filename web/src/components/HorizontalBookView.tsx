// SPDX-FileCopyrightText: 2020 mtgto <hogerappa@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

import Box from "@mui/material/Box";
import type { History } from "history";
import { useEffect, useRef, useState, type RefObject } from "react";
import { useInView } from "react-intersection-observer";
import { useHistory } from "rocon/react";
import type { Book } from "../domain/book.ts";
import NavigationPage from "./NavigationPage.tsx";

type Props = Readonly<{
  pageIndex: number;
  book: Book;
  nextBook?: Book;
  direction: "left" | "right";
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
  }>
) => {
  const { ref } = useInView({
    onChange: (inView) => {
      if (inView) {
        props.history.replace({
          hash: props.index === 0 ? "" : `${props.index}`,
        });
      }
    },
  });
  return (
    <Box
      id={`${props.index}`}
      ref={(element: HTMLElement) => {
        props.refs.current[props.index] = element;
      }}
      display="flex"
      mx="auto"
      width="100%"
      height="100%"
      flexShrink={0}
      sx={{ scrollSnapAlign: "start" }}
      onClick={props.onClick}
    >
      <Box
        ref={ref}
        component="img"
        loading={props.loading}
        my="auto"
        mx="auto"
        maxHeight="100%"
        maxWidth="100%"
        src={`/images/books/${props.book.id}/pages/${props.index}`}
        display="block"
      />
    </Box>
  );
};

const pages = (
  currentPageIndex: number,
  book: Book,
  history: History,
  refs: RefObject<HTMLElement[]>,
  onPreviousPage: () => void,
  onNextPage: () => void
) => {
  const onClick = (e: React.MouseEvent) => {
    if (e.shiftKey) {
      onPreviousPage();
    } else {
      onNextPage();
    }
  };

  return [...Array(book.pageCount).keys()].map((i: number) => {
    return (
      <Page
        key={i}
        index={i}
        book={book}
        history={history}
        refs={refs}
        loading={Math.abs(currentPageIndex - i) <= 1 ? "eager" : "lazy"}
        onClick={onClick}
      />
    );
  });
};

const HorizontalBookView = (props: Props) => {
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
    <Box
      display="flex"
      flexDirection={props.direction === "right" ? "row" : "row-reverse"}
      sx={{
        width: "100%",
        height: "100vh",
        scrollSnapType: "x mandatory",
        overflowX: "auto",
      }}
    >
      {pages(props.pageIndex, props.book, history, refs, props.onPreviousPage, props.onNextPage)}
      <Box
        display="flex"
        flexDirection="column"
        width="100%"
        height="100%"
        flexShrink={0}
        justifyContent="center"
        alignItems="center"
        sx={{ scrollSnapAlign: "start" }}
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

export default HorizontalBookView;
