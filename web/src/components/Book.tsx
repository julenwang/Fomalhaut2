// SPDX-FileCopyrightText: 2020 mtgto <hogerappa@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

import React, {
  useContext,
  useState,
  useTransition,
  useDebugValue,
} from "react";
import { useNavigate } from "rocon/react";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import MoveDownIcon from "@mui/icons-material/MoveDown";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import Container from "@mui/material/Container";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import { useTheme } from "@mui/material/styles";
import type { Book } from "../domain/book.ts";
import { message } from "../message.ts";
import { StateContext, toggleLike } from "../reducer.ts";
import HorizontalBookView from "./HorizontalBookView.tsx";
import Layout from "./Layout.tsx";
import { bookRoutes } from "./Routes.tsx";
import VerticalBookView from "./VerticalBookView.tsx";
import { AddToCollection } from "./AddToCollection.tsx";
import PageSliderDialog from "./PageSliderDialog.tsx";

type Props = {
  readonly id: string;
};

const BookPage: React.FunctionComponent<Props> = (props: Props) => {
  const [calling, startToggleLike] = useTransition();
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [addToCollectionOpen, setAddToCollectionOpen] = useState(false);
  const [reading, setReading] = useState(true);
  const [pageIndex, setPageIndex] = useState(() => {
    const page = parseInt(
      sessionStorage.getItem(`net.mtgto.Fomalhaut2.page.${props.id}`) ?? "",
    );
    return isNaN(page) ? 0 : page;
  });
  useDebugValue(pageIndex);
  const [pageSliderOpen, setPageSliderOpen] = useState(false);
  const { state, dispatch } = useContext(StateContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const book: Book | undefined = state.books.find(
    (book) => book.id === props.id,
  );
  const currentBookIndex = state.selectedBookIds.findIndex(
    (bookId) => props.id === bookId,
  );
  const nextBookId: string | undefined =
    state.selectedBookIds.length > currentBookIndex + 1
      ? state.selectedBookIds[currentBookIndex + 1]
      : undefined;
  const nextBook: Book | undefined = nextBookId
    ? state.books.find((book) => book.id === nextBookId)
    : undefined;

  const navigateBookId = (bookId: string | undefined) => {
    if (bookId) {
      navigate(bookRoutes.anyRoute, { id: bookId });
    }
  };
  const prevBookId: string | undefined =
    currentBookIndex > 0
      ? state.selectedBookIds[currentBookIndex - 1]
      : undefined;

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSpeedDialOpen(false);
  };

  const handleChoosePage = () => {
    setPageSliderOpen(true);
    setSpeedDialOpen(false);
  };

  const handlePageSliderClose = (pageIndex?: number) => {
    if (pageIndex != null) {
      setPageIndex(() => pageIndex);
    }
    setPageSliderOpen(false);
  };

  const handleToggleLike = () => {
    startToggleLike(async () => {
      if (book) {
        try {
          await fetch(
            `/api/v1/books/${book.id}/${book.like ? "dislike" : "like"}`,
            {
              method: "POST",
            },
          );
          dispatch(toggleLike(book.id));
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  const handleAddToCollection = () => {
    setAddToCollectionOpen(true);
    setSpeedDialOpen(false);
  };

  const handleNextBook = () => {
    navigateBookId(nextBookId);
    window.scrollTo(0, 0);
    setSpeedDialOpen(false);
  };

  const handlePrev = () => {
    navigateBookId(prevBookId);
    window.scrollTo(0, 0);
    setSpeedDialOpen(false);
  };

  const handleGoFirst = () => {
    const firstPage = document.getElementById("0");
    if (firstPage) {
      firstPage.scrollIntoView({ behavior: "smooth" });
      setPageIndex(0);
    }
  };

  const handleSpeedDialClose = () => {
    setSpeedDialOpen(false);
    setReading(true);
  };

  const handleSpeedDialOpen = () => {
    setSpeedDialOpen(true);
    setReading(false);
  };

  const handleRandom = () => {
    if (state.books.length > 0) {
      const index = Math.floor(Math.random() * state.books.length);
      const book = state.books[index];
      navigate(bookRoutes.anyRoute, { id: book.id });
    }
  };

  const handlePreviousPage = () => {
    setPageIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextPage = () => {
    if (book) {
      setPageIndex((prev) => (prev < book.pageCount ? prev + 1 : prev));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === "Space") {
      e.preventDefault();
      if (e.shiftKey) {
        handlePreviousPage();
      } else {
        handleNextPage();
      }
    } else if (
      (state.viewMode === "right" && e.code === "ArrowRight") ||
      (state.viewMode === "left" && e.code === "ArrowLeft") ||
      (state.viewMode === "vertical" && e.code === "ArrowDown")
    ) {
      e.preventDefault();
      handleNextPage();
    } else if (
      (state.viewMode === "right" && e.code === "ArrowLeft") ||
      (state.viewMode === "left" && e.code === "ArrowRight") ||
      (state.viewMode === "vertical" && e.code === "ArrowUp")
    ) {
      e.preventDefault();
      handlePreviousPage();
    }
  };

  if (book) {
    return (
      <Layout title={book.name}>
        <title>{`${book?.name ?? "Loading…"} - Fomalhaut2`}</title>
        <Container
          maxWidth={false}
          disableGutters
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {state.viewMode === "left" || state.viewMode === "right" ? (
            <HorizontalBookView
              pageIndex={pageIndex}
              book={book}
              nextBook={nextBook}
              direction={state.viewMode}
              onNextBook={handleNextBook}
              onRandom={handleRandom}
              onPreviousPage={handlePreviousPage}
              onNextPage={handleNextPage}
            />
          ) : (
            <VerticalBookView
              pageIndex={pageIndex}
              book={book}
              nextBook={nextBook}
              onNextBook={handleNextBook}
              onRandom={handleRandom}
              onPreviousPage={handlePreviousPage}
              onNextPage={handleNextPage}
            />
          )}
          <SpeedDial
            ariaLabel="direction"
            sx={{
              position: "fixed",
              bottom: theme.spacing(8),
              right: theme.spacing(2),
              opacity: reading ? 0.25 : 1.0,
            }}
            open={speedDialOpen}
            onOpen={handleSpeedDialOpen}
            onClose={handleSpeedDialClose}
            icon={<SpeedDialIcon />}
          >
            <SpeedDialAction
              onClick={handleScrollToTop}
              icon={<KeyboardArrowUpIcon />}
              slotProps={{ tooltip: { title: message.commands.scrollToTop } }}
            />
            <SpeedDialAction
              onClick={handleChoosePage}
              icon={<MoveDownIcon />}
              slotProps={{ tooltip: { title: message.commands.choosePage } }}
            />
            <SpeedDialAction
              onClick={handleToggleLike}
              icon={book?.like ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              slotProps={{
                tooltip: {
                  title: book?.like
                    ? message.commands.dislike
                    : message.commands.like,
                },
                fab: { disabled: calling },
              }}
            />
            <SpeedDialAction
              onClick={handleAddToCollection}
              icon={<BookmarkAddIcon />}
              slotProps={{
                tooltip: { title: message.commands.addToCollection },
              }}
            />
            {nextBookId ? (
              <SpeedDialAction
                onClick={handleNextBook}
                icon={<SkipNextIcon />}
                slotProps={{ tooltip: { title: message.commands.next } }}
              />
            ) : null}
            {prevBookId ? (
              <SpeedDialAction
                onClick={handlePrev}
                icon={<SkipPreviousIcon />}
                slotProps={{ tooltip: { title: message.commands.prev } }}
              />
            ) : null}
            <SpeedDialAction
              onClick={handleGoFirst}
              icon={<VerticalAlignTopIcon />}
              slotProps={{ tooltip: { title: message.commands.goFirst } }}
            />
          </SpeedDial>
          <AddToCollection
            bookId={book.id}
            open={addToCollectionOpen}
            onClose={() => setAddToCollectionOpen(false)}
          />
          <PageSliderDialog
            key={pageIndex}
            open={pageSliderOpen}
            currentPageIndex={pageIndex}
            pageCount={book.pageCount}
            onClose={handlePageSliderClose}
          />
        </Container>
      </Layout>
    );
  } else {
    return (
      <Layout title={undefined}>
        <Container maxWidth="md">
          <span>{message.loading}</span>
        </Container>
      </Layout>
    );
  }
};
BookPage.displayName = "Book";
export default BookPage;
