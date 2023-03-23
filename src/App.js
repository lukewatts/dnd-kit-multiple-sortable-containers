import React, { createContext, useContext, useState } from "react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable
} from "@dnd-kit/core";
import {
  // arrayMove,
  useSortable,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./styles.css";

import defaultAnnouncements from "./defaultAnnouncements";

const initialState = {
  columns: [
    {
      items: [
        { id: 1, title: "Item 1" },
        { id: 2, title: "Item 2" },
        { id: 3, title: "Item 3" }
      ]
    },
    {
      items: [
        { id: 4, title: "Item 4" },
        { id: 5, title: "Item 5" },
        { id: 6, title: "Item 6" }
      ]
    },
    {
      items: [
        { id: 7, title: "Item 7" },
        { id: 8, title: "Item 8" },
        { id: 9, title: "Item 9" },
        { id: 10, title: "Item 10" }
      ]
    },
    {
      items: [
        { id: 11, title: "Item 11" },
        { id: 12, title: "Item 12" },
        { id: 13, title: "Item 13" }
      ]
    }
  ]
};

const DataContext = createContext(initialState);

const App = () => {
  const [data, setData] = useState(initialState);
  return (
    <DataContext.Provider value={{ data, setData }}>
      <div className="tw-flex tw-flex-col">
        <Columns />
      </div>
    </DataContext.Provider>
  );
};

const Columns = () => {
  const { data, setData } = useContext(DataContext);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );
  return (
    <DndContext
      onDragOver={(e) => {
        const { active, over } = e;
        const activeSortable = active.data.current.sortable;
        const overSortable = over.data.current.sortable;

        if (activeSortable.containerId === overSortable.containerId) {
          return;
        }

        setData((current) => {
          const activeColumn = current.columns[activeSortable.index];
          const overColumn = current.columns[overSortable.index];

          let newIndex;

          return newState;
        });
      }}
      // onDragEnd={(e) => {
      //   const { active, over } = e;
      // }}
      collisionDetection={closestCorners}
      announcements={defaultAnnouncements}
      sensors={sensors}
    >
      <div id="columns" className="tw-block">
        <div className="tw-grid tw-grid-cols-4 tw-gap-4">
          {data.columns.map((column, index) => (
            <Column
              column={column}
              index={index}
              id={`column_${index}`}
              key={`column_${index}`}
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
};

const Column = (props) => {
  const { id, index, column } = props;
  const { setNodeRef } = useDroppable({
    id,
    data: { column, index }
  });

  return (
    <SortableContext
      id={id}
      items={column.items}
      strategy={verticalListSortingStrategy}
    >
      <div className="tw-col-span-1">
        <h1>Column {index}</h1>
        <div className="tw-flex tw-flex-col tw-h-full">
          <div className="tw-block tw-h-full tw-w-full tw-rounded-md tw-bg-gray-50 tw-p-4">
            <ul
              ref={setNodeRef}
              className="tw-block tw-h-full tw-w-full tw-border-2 tw-border-dashed tw-border-transparent"
            >
              {column.items.map((item) => (
                <ColumnItem item={item} id={item.id} key={`item_${item.id}`} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SortableContext>
  );
};

const ColumnItem = (props) => {
  const { id, item } = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id, data: item });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="tw-p-4 tw-mb-2 tw-bg-white"
    >
      {item.title}
    </li>
  );
};

export default App;
