// SPDX-FileCopyrightText: 2020 mtgto <hogerappa@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

import Box from "@mui/material/Box";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { useInView } from "react-intersection-observer";
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
    refs: RefObject<HTMLElement[]>;
    loading: HTMLImageElement["loading"];
    onClick: (e: React.MouseEvent) => void;
  }>,
) => {
  const { ref } = useInView({
    onChange: (inView) => {
      if (inView) {
        sessionStorage.setItem(`net.mtgto.Fomalhaut2.page.${props.book.id}`, String(props.index));
      }
    },
  });
  const setRef = useCallback(
    (element: HTMLElement) => {
      props.refs.current[props.index] = element;
    },
    [props.refs, props.index],
  );
  return (
    <Box
      id={`${props.index}`}
      ref={setRef}
      sx={{
        display: "flex",
        flexShrink: 0,
        scrollSnapAlign: "start",
        width: "100%",
        height: "100%",
        mx: "auto",
      }}
      onClick={props.onClick}
    >
      <Box
        ref={ref}
        component="img"
        loading={props.loading}
        src={`/images/books/${props.book.id}/pages/${props.index}`}
        sx={{
          display: "block",
          mx: "auto",
          my: "auto",
          maxHeight: "100%",
          maxWidth: "100%",
        }}
      />
    </Box>
  );
};

const Pages = (
  props: Readonly<{
    currentPageIndex: number;
    book: Book;
    refs: RefObject<HTMLElement[]>;
    onPreviousPage: () => void;
    onNextPage: () => void;
  }>,
) => {
  const onClick = (e: React.MouseEvent) => {
    if (e.shiftKey) {
      props.onPreviousPage();
    } else {
      props.onNextPage();
    }
  };

  return [...Array(props.book.pageCount).keys()].map((i: number) => (
    <Page
      key={i}
      index={i}
      book={props.book}
      refs={props.refs}
      loading={Math.abs(props.currentPageIndex - i) <= 1 ? "eager" : "lazy"}
      onClick={onClick}
    />
  ));
};

const HorizontalBookView = (props: Props) => {
  const refs = useRef<HTMLElement[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const { ref: navInViewRef } = useInView({
    onChange: (inView) => {
      if (inView) {
        sessionStorage.setItem(
          `net.mtgto.Fomalhaut2.page.${props.book.id}`,
          String(props.book.pageCount),
        );
      }
    },
  });
  const navRef = useCallback(
    (element: HTMLElement | null) => {
      if (element) refs.current[props.book.pageCount] = element;
      navInViewRef(element);
    },
    [navInViewRef, props.book.pageCount],
  );

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
      sx={{
        display: "flex",
        flexDirection: props.direction === "right" ? "row" : "row-reverse",
        width: "100%",
        height: "100vh",
        scrollSnapType: "x mandatory",
        overflowX: "auto",
      }}
    >
      <Pages
        currentPageIndex={props.pageIndex}
        book={props.book}
        refs={refs}
        onPreviousPage={props.onPreviousPage}
        onNextPage={props.onNextPage}
      />
      <Box
        ref={navRef}
        id={props.book.pageCount.toString()}
        sx={{
          display: "flex",
          scrollSnapAlign: "start",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
          width: "100%",
          height: "100%",
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

export default HorizontalBookView;
