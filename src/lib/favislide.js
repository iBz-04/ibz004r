let i = 0;
const faviconLink = document.querySelector("link[rel=icon]");

const icons = [
	"PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDM5QzMwLjQ5MzQgMzkgMzkgMzAuNDkzNCAzOSAyMEMzOSA5LjUwNjU5IDMwLjQ5MzQgMSAyMCAxQzkuNTA2NTkgMSAxIDkuNTA2NTkgMSAyMEMxIDMwLjQ5MzQgOS41MDY1OSAzOSAyMCAzOVoiIGZpbGw9IiNFQzdDNEMiIHN0cm9rZT0iI0VDN0M0QyIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPgo=",
	"PHN2ZyB3aWR0aD0iNDEiIGhlaWdodD0iNDIiIHZpZXdCb3g9IjAgMCA0MSA0MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEgMzNWOUMxIDQuNTgxNzIgNC41ODE3IDEgOSAxSDM1LjM3N0MzOS4wNjc2IDEgNDAuNzg5MyA1LjU3MjM1IDM4LjAxNTIgOC4wMDY1OUwyNi42MzQxIDE3Ljk5MzRDMjQuODE4NSAxOS41ODY2IDI0LjgxODUgMjIuNDEzNCAyNi42MzQxIDI0LjAwNjZMMzguMDE1MiAzMy45OTM0QzQwLjc4OTMgMzYuNDI3NyAzOS4wNjc2IDQxIDM1LjM3NyA0MUg5QzQuNTgxNyA0MSAxIDM3LjQxODMgMSAzM1oiIGZpbGw9IiM2N0M1NzEiIHN0cm9rZT0iIzY3QzU3MSIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPgo=",
	"PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iNDUiIHZpZXdCb3g9IjAgMCAyNCA0NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPG1hc2sgaWQ9Im1hc2swXzE2XzciIHN0eWxlPSJtYXNrLXR5cGU6bHVtaW5hbmNlIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjQiIGhlaWdodD0iNDUiPgo8cGF0aCBkPSJNMjIgNi42NjY4NkMyMiA0LjQ1NzcyIDIwLjE5MiAyLjYyNjU0IDE4LjAyNiAzLjA2NTQ3QzE0LjIwMyAzLjg0MDcgMTAuNjU4IDUuNzI0NzMgNy44NTc5IDguNTI0NzJDNC4xMDcxIDEyLjI3NTUgMiAxNy4zNjI2IDIgMjIuNjY2OUMyIDI3Ljk3MTIgNC4xMDcxIDMzLjA1ODMgNy44NTc5IDM2LjgwOUMxMC42NTggMzkuNjA5IDE0LjIwMyA0MS40OTMxIDE4LjAyNiA0Mi4yNjgzQzIwLjE5MiA0Mi43MDcyIDIyIDQwLjg3NiAyMiAzOC42NjY5VjIyLjY2NjlWNi42NjY4NloiIGZpbGw9IiM0QjQ0MzgiIHN0cm9rZT0iIzRCNDQzOCIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjwvbWFzaz4KPGcgbWFzaz0idXJsKCNtYXNrMF8xNl83KSI+CjxwYXRoIGQ9Ik0yMiA2LjY2Njg2QzIyIDQuNDU3NzIgMjAuMTkyIDIuNjI2NTQgMTguMDI2IDMuMDY1NDdDMTQuMjAzIDMuODQwNyAxMC42NTggNS43MjQ3MyA3Ljg1NzkgOC41MjQ3MkM0LjEwNzEgMTIuMjc1NSAyIDE3LjM2MjYgMiAyMi42NjY5QzIgMjcuOTcxMiA0LjEwNzEgMzMuMDU4MyA3Ljg1NzkgMzYuODA5QzEwLjY1OCAzOS42MDkgMTQuMjAzIDQxLjQ5MzEgMTguMDI2IDQyLjI2ODNDMjAuMTkyIDQyLjcwNzIgMjIgNDAuODc2IDIyIDM4LjY2NjlWMjIuNjY2OVY2LjY2Njg2WiIgZmlsbD0iIzRCNDQzOCIgc3Ryb2tlPSIjNEI0NDM4IiBzdHJva2Utd2lkdGg9IjQiLz4KPC9nPgo8L3N2Zz4K",
	"PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iNDUiIHZpZXdCb3g9IjAgMCAyNCA0NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPG1hc2sgaWQ9Im1hc2swXzE2XzExIiBzdHlsZT0ibWFzay10eXBlOmx1bWluYW5jZSIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjQ1Ij4KPHBhdGggZD0iTTIgNi42NjY4NkMyIDQuNDU3NzIgMy44MDggMi42MjY1NCA1Ljk3NCAzLjA2NTQ3QzkuNzk3IDMuODQwNyAxMy4zNDIgNS43MjQ3MyAxNi4xNDIgOC41MjQ3MkMxOS44OTMgMTIuMjc1NSAyMiAxNy4zNjI2IDIyIDIyLjY2NjlDMjIgMjcuOTcxMiAxOS44OTMgMzMuMDU4MyAxNi4xNDIgMzYuODA5QzEzLjM0MiAzOS42MDkgOS43OTcgNDEuNDkzMSA1Ljk3NCA0Mi4yNjgzQzMuODA4IDQyLjcwNzIgMiA0MC44NzYgMiAzOC42NjY5VjIyLjY2NjlWNi42NjY4NloiIGZpbGw9IiNGNEM3MjUiIHN0cm9rZT0iI0Y0QzcyNSIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjwvbWFzaz4KPGcgbWFzaz0idXJsKCNtYXNrMF8xNl8xMSkiPgo8cGF0aCBkPSJNMiA2LjY2Njg2QzIgNC40NTc3MiAzLjgwOCAyLjYyNjU0IDUuOTc0IDMuMDY1NDdDOS43OTcgMy44NDA3IDEzLjM0MiA1LjcyNDczIDE2LjE0MiA4LjUyNDcyQzE5Ljg5MyAxMi4yNzU1IDIyIDE3LjM2MjYgMjIgMjIuNjY2OUMyMiAyNy45NzEyIDE5Ljg5MyAzMy4wNTgzIDE2LjE0MiAzNi44MDlDMTMuMzQyIDM5LjYwOSA5Ljc5NyA0MS40OTMxIDUuOTc0IDQyLjI2ODNDMy44MDggNDIuNzA3MiAyIDQwLjg3NiAyIDM4LjY2NjlWMjIuNjY2OVY2LjY2Njg2WiIgZmlsbD0iI0Y0QzcyNSIgc3Ryb2tlPSIjRjRDNzI1IiBzdHJva2Utd2lkdGg9IjQiLz4KPC9nPgo8L3N2Zz4K",
];

setInterval(() => {
	const n = icons[i];
	faviconLink.href = `data:image/svg+xml;base64,${n}`;

	i = (i + 1) % icons.length;
}, 5_000);
